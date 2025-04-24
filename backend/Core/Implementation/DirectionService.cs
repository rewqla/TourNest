using System.Globalization;
using Contract;
using Core.Interfaces;
using Core.Models;
using ExternalApis.Models;
using Microsoft.Extensions.Logging;

namespace Core.Implementation;

public class DirectionService : IDirectionService
{
    private readonly IMapboxService _mapboxService;
    private readonly IPlacesService _placesService;

    public DirectionService(
        IMapboxService mapboxService,
        IPlacesService placesService)
    {
        _mapboxService = mapboxService;
        _placesService = placesService;
    }

    public async Task<DirectionResult> GetDirectionWithPlacesAsync(
        Location startLocation,
        Location endLocation,
        List<string> categories,
        int maxDetourDistance = 2000,
        int maxPlacesToVisit = 4)
    {
        // Input validation
        if (startLocation == null || string.IsNullOrEmpty(startLocation.Lat) || string.IsNullOrEmpty(startLocation.Lng))
            throw new ArgumentException("Start location is required");

        if (endLocation == null || string.IsNullOrEmpty(endLocation.Lat) || string.IsNullOrEmpty(endLocation.Lng))
            throw new ArgumentException("End location is required");

        if (categories == null || !categories.Any())
            throw new ArgumentException("At least one category is required");

        // Step 1: Get direct route from start to end
        //var directRoute = await _mapboxService.GetRouteAsync(startLocation, endLocation);

        // Step 2: Find interesting places near the route
        var placesNearRoute = await _placesService.FindPlacesNearRouteAsync(
            startLocation, endLocation, categories, maxDetourDistance);

        // Step 3: Select top places to visit based on ratings and distance from route
        var selectedPlaces = SelectBestPlaces(placesNearRoute, maxPlacesToVisit);

        // Step 4: Create optimal route with waypoints
        var routeWithWaypoints = await CreateOptimalRouteWithWaypoints(
            startLocation, endLocation, selectedPlaces);

        // Create and return response
        return new DirectionResult
        {
            Route = routeWithWaypoints,
            PlacesToVisit = selectedPlaces,
            TotalDistance = routeWithWaypoints.Distance,
            EstimatedTime = routeWithWaypoints.Duration
        };
    }

    private List<Place> SelectBestPlaces(List<Place> places, int maxPlaces)
    {
        // Get all unique category IDs from all places
        var categoryGroups = places
            .SelectMany(p => p.Categories)
            .Select(c => c.Id.Substring(0, 1))
            .Distinct()
            .ToList();

        var result = new List<Place>();

        // For each category, select the best place (if not already selected)
        foreach (var categoryPrefix in categoryGroups)
        {
            // Skip if we've already reached maxPlaces
            if (result.Count >= maxPlaces)
                break;

            // Find places with this category that aren't already selected
            var placesWithCategory = places
                .Where(p => p.Categories.Any(c => c.Id.StartsWith(categoryPrefix)) && !result.Contains(p))
                .OrderByDescending(p => p.Rating)
                .ThenBy(p => p.Distance);

            var bestPlaceForCategory = placesWithCategory.FirstOrDefault();

            if (bestPlaceForCategory != null)
            {
                result.Add(bestPlaceForCategory);
            }
        }

        // If we haven't filled maxPlaces yet, add remaining best places
        if (result.Count < maxPlaces)
        {
            var remainingPlaces = places
                .Where(p => !result.Contains(p))
                .OrderByDescending(p => p.Rating)
                .ThenBy(p => p.Distance)
                .Take(maxPlaces - result.Count);

            result.AddRange(remainingPlaces);
        }

        return result;
    }

    private async Task<RouteResult> CreateOptimalRouteWithWaypoints(
        Location start, Location end, List<Place> places)
    {
        // Step 1: Create a list of all points in order
        var allPoints = new List<Location> { start };

        // Step 2: Add waypoints in optimal order
        var orderedPlaces = OptimizeWaypointOrder(start, end, places);

        foreach (var place in orderedPlaces)
        {
            allPoints.Add(place.Location);
        }

        // Add the end location
        allPoints.Add(end);

        // Step 3: Get route with all waypoints
        return await _mapboxService.GetRouteWithWaypointsAsync(allPoints);
    }

    private List<Place> OptimizeWaypointOrder(Location start, Location end, List<Place> places)
    {
        if (!places.Any())
            return new List<Place>();

        // Using a modified nearest insertion algorithm that accounts for both start and end
        var result = new List<Place>();
        var unvisitedPlaces = new List<Place>(places);

        // Initialize with a path from start to end
        var totalPathDistance = CalculateDistance(
            start.Lat, start.Lng,
            end.Lat, end.Lng);

        // For each unvisited place, find the best insertion point in the current path
        while (unvisitedPlaces.Any())
        {
            Place bestPlace = null;
            double bestIncrease = double.MaxValue;

            foreach (var place in unvisitedPlaces)
            {
                // Calculate the increased distance if we insert this place between start and end
                // or at the appropriate position in the existing path

                // For empty result (direct start to end), we're inserting between start and end
                if (result.Count == 0)
                {
                    var newDistance =
                        CalculateDistance(start.Lat, start.Lng, place.Location.Lat, place.Location.Lng) +
                        CalculateDistance(place.Location.Lat, place.Location.Lng, end.Lat, end.Lng);

                    var increase = newDistance - totalPathDistance;

                    if (increase < bestIncrease)
                    {
                        bestIncrease = increase;
                        bestPlace = place;
                    }
                }
                else
                {
                    // Try inserting at each position in the path
                    for (int i = 0; i <= result.Count; i++)
                    {
                        Location before = i == 0 ? start : result[i - 1].Location;
                        Location after = i == result.Count ? end : result[i].Location;

                        // Calculate the increase in distance
                        var oldSegment = CalculateDistance(before.Lat, before.Lng, after.Lat, after.Lng);

                        var newSegments =
                            CalculateDistance(before.Lat, before.Lng, place.Location.Lat, place.Location.Lng) +
                            CalculateDistance(place.Location.Lat, place.Location.Lng, after.Lat, after.Lng);

                        var increase = newSegments - oldSegment;

                        if (increase < bestIncrease)
                        {
                            bestIncrease = increase;
                            bestPlace = place;
                        }
                    }
                }
            }

            // Insert the best place at its optimal position
            if (result.Count == 0)
            {
                result.Add(bestPlace);
            }
            else
            {
                // Find the best insertion position
                int bestPosition = 0;
                double bestPositionIncrease = double.MaxValue;

                for (int i = 0; i <= result.Count; i++)
                {
                    Location before = i == 0 ? start : result[i - 1].Location;
                    Location after = i == result.Count ? end : result[i].Location;

                    var oldSegment = CalculateDistance(before.Lat, before.Lng, after.Lat, after.Lng);

                    var newSegments =
                        CalculateDistance(before.Lat, before.Lng, bestPlace.Location.Lat, bestPlace.Location.Lng) +
                        CalculateDistance(bestPlace.Location.Lat, bestPlace.Location.Lng, after.Lat, after.Lng);

                    var increase = newSegments - oldSegment;

                    if (increase < bestPositionIncrease)
                    {
                        bestPositionIncrease = increase;
                        bestPosition = i;
                    }
                }

                result.Insert(bestPosition, bestPlace);
            }

            // Update total path distance
            totalPathDistance += bestIncrease;
            unvisitedPlaces.Remove(bestPlace);
        }

        return result;
    }

    private double CalculateDistance(string lat1Str, string lng1Str, string lat2Str, string lng2Str)
    {
        if (!double.TryParse(lat1Str, CultureInfo.InvariantCulture, out double lat1) ||
            !double.TryParse(lng1Str, CultureInfo.InvariantCulture, out double lng1) ||
            !double.TryParse(lat2Str, CultureInfo.InvariantCulture, out double lat2) ||
            !double.TryParse(lng2Str, CultureInfo.InvariantCulture, out double lng2))
        {
            throw new ArgumentException("Invalid coordinate format");
        }

        return CalculateDistance(lat1, lng1, lat2, lng2);
    }

    private double CalculateDistance(double lat1, double lng1, double lat2, double lng2)
    {
        const double EarthRadiusMeters = 6371000; // Earth's radius in meters

        // Convert latitude and longitude from degrees to radians
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLng = (lng2 - lng1) * Math.PI / 180;

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return EarthRadiusMeters * c; // Distance in meters
    }

    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}