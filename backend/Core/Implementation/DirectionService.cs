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
        // Step 1: Add waypoints in optimal order
        var orderedWaypoints = OptimizeWaypointOrder(start, end, places.Select(x => x.Location).ToList());

        // Step 2: Get route with all waypoints
        return await _mapboxService.GetRouteWithWaypointsAsync(orderedWaypoints);
    }

    private List<Location> OptimizeWaypointOrder(Location start, Location end, List<Location> waypoints)
    {
        var unvisited = new List<Location>(waypoints);
        var current = start;
        var route = new List<Location>();

        while (unvisited.Any())
        {
            var nearest = unvisited
                .OrderBy(loc => CalculateDistance(current, loc))
                .First();

            route.Add(nearest);
            current = nearest;
            unvisited.Remove(nearest);
        }

        // Крок 2: Оптимізація порядку точок за допомогою 2-opt
        // route = ApplyTwoOptWithFixedEnds(start, end, route);

        // Крок 3: Додати початок і кінець
        var finalRoute = new List<Location> { start };
        finalRoute.AddRange(route);
        finalRoute.Add(end);

        return finalRoute;
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

    private double CalculateDistance(Location point1, Location point2)
    {
        const double EarthRadiusMeters = 6371000; // Радіус Землі в метрах

        if (!double.TryParse(point1.Lat, CultureInfo.InvariantCulture, out double lat1) ||
            !double.TryParse(point1.Lng, CultureInfo.InvariantCulture, out double lng1) ||
            !double.TryParse(point2.Lat, CultureInfo.InvariantCulture, out double lat2) ||
            !double.TryParse(point2.Lng, CultureInfo.InvariantCulture, out double lng2))
        {
            throw new ArgumentException("Invalid coordinate format");
        }

        // Переведення в радіани
        double dLat = ToRadians(lat2 - lat1);
        double dLng = ToRadians(lng2 - lng1);

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                   Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return EarthRadiusMeters * c;
    }

    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}