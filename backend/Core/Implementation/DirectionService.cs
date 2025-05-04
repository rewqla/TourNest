using System.Globalization;
using Contract;
using Contract.Enums;
using Core.Interfaces;
using Core.Mapping;
using Core.Models;
using ExternalApis;
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
        RouteType routeType,
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
        var selectedPlaces = SelectBestPlaces(placesNearRoute, maxPlacesToVisit, categories);

        // Step 4: Create optimal route with waypoints
        // var routeWithWaypoints = await CreateOptimalRouteWithWaypoints(
        //     startLocation, endLocation, selectedPlaces);

        var waypoints = new List<Location> { startLocation };
        waypoints.AddRange(selectedPlaces.Select(x => x.Location)); // додаємо вибрані місця
        waypoints.Add(endLocation);

        var routeWithWaypoints = await _mapboxService.GetOptimizedRouteWithWaypointsAsync(waypoints, routeType);

        // Create and return response
        return new DirectionResult
        {
            Route = routeWithWaypoints,
            PlacesToVisit = selectedPlaces,
            TotalDistance = routeWithWaypoints.Distance,
            EstimatedTime = routeWithWaypoints.Duration
        };
    }

    private List<Place> SelectBestPlaces(List<Place> places, int maxPlaces, List<string> categories)
    {
        var result = new List<Place>();

        var categoryToNumber = new Dictionary<string, int>
        {
            { "restaurant", 1 },
            { "cafe", 1 },
            { "atm", 7 },
            { "theatre", 2 },
            { "hotel", 5 },
            { "museum", 3 },
            { "park", 5 },
            { "shopping", 6 }
        };

        var selectedCategoryNumbers = categories
            .Where(c => categoryToNumber.ContainsKey(c))
            .Select(c => categoryToNumber[c])
            .Distinct()
            .ToList();

        // Get places by category number (first digit of category ID)
        var placesByCategory = places
            .GroupBy(p => p.Categories
                .Where(c => selectedCategoryNumbers.Contains(int.Parse(c.Id.Substring(0, 1))))
                .Select(c => int.Parse(c.Id.Substring(0, 1)))
                .FirstOrDefault())
            .Where(group => group.Key != 0) // Exclude groups with no valid category number
            .ToList();

        // For each category number, select the best place
        foreach (var categoryNumber in selectedCategoryNumbers)
        {
            // Skip if we've already reached maxPlaces
            if (result.Count >= maxPlaces)
                break;

            // Get places of this category
            var placesForCategory = placesByCategory
                .FirstOrDefault(g => g.Key == categoryNumber)?
                .OrderByDescending(p => p.Rating)
                .ThenBy(p => p.Distance)
                .ToList();

            // Select the best place for this category (if available)
            if (placesForCategory != null && placesForCategory.Any())
            {
                var bestPlaceForCategory = placesForCategory.First();
                if (!result.Contains(bestPlaceForCategory))
                {
                    result.Add(bestPlaceForCategory);
                }
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
        Location start, Location end, List<Place> places, RouteType routeType)
    {
        // Step 1: Add waypoints in optimal order
        var orderedWaypoints = OptimizeWaypointOrder(start, end, places);

        // Step 2: Get route with all waypoints
        return await _mapboxService.GetRouteWithWaypointsAsync(orderedWaypoints.Select(x => x.Location).ToList(), routeType);
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

    private static IEnumerable<IEnumerable<T>> GetPermutations<T>(List<T> list, int length)
    {
        if (length == 1) return list.Select(t => new T[] { t });

        return GetPermutations(list, length - 1)
            .SelectMany(t => list.Where(e => !t.Contains(e)),
                (t, e) => t.Concat(new T[] { e }));
    }

    private List<Location> ApplyTwoOptWithFixedEnds(Location start, Location end, List<Location> route)
    {
        bool improvement = true;
        var best = new List<Location>(route);
        double bestDistance = CalculateTotalDistance(start, end, best);

        while (improvement)
        {
            improvement = false;

            for (int i = 0; i < best.Count - 1; i++)
            {
                for (int j = i + 1; j < best.Count; j++)
                {
                    var newRoute = TwoOptSwap(best, i, j);
                    double newDistance = CalculateTotalDistance(start, end, newRoute);

                    if (newDistance < bestDistance)
                    {
                        best = newRoute;
                        bestDistance = newDistance;
                        improvement = true;
                    }
                }
            }
        }

        return best;
    }

    private List<Location> TwoOptSwap(List<Location> route, int i, int j)
    {
        var newRoute = new List<Location>();
        newRoute.AddRange(route.Take(i));
        newRoute.AddRange(route.Skip(i).Take(j - i + 1).Reverse());
        newRoute.AddRange(route.Skip(j + 1));
        return newRoute;
    }

    private double CalculateDistance(Location loc1, Location loc2)
    {
        const double EarthRadius = 6371;

        var lat1 = loc1.GetLatInDouble();
        var lng1 = loc1.GetLngInDouble();
        var lat2 = loc2.GetLatInDouble();
        var lng2 = loc2.GetLngInDouble();

        // Convert degrees to radians
        var dLat = ToRadians(lat2 - lat1);
        var dLng = ToRadians(lng2 - lng1);

        // Haversine formula
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return EarthRadius * c; // Distance in kilometers
    }

    private double CalculateTotalDistance(Location start, Location end, List<Location> route)
    {
        double total = 0;
        var current = start;

        foreach (var next in route)
        {
            total += CalculateDistance(current, next);
            current = next;
        }

        total += CalculateDistance(current, end);
        return total;
    }

    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}