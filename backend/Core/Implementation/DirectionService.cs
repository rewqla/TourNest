using System.Globalization;
using Contract;
using Core.Interfaces;
using Core.Mapping;
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
        var selectedPlaces = SelectBestPlaces(placesNearRoute, maxPlacesToVisit, categories);

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
        Location start, Location end, List<Place> places)
    {
        // Step 1: Add waypoints in optimal order
        var orderedWaypoints = OptimizeWaypointOrder(start, end, places.Select(x => x.Location).ToList());

        // Step 2: Get route with all waypoints
        return await _mapboxService.GetRouteWithWaypointsAsync(orderedWaypoints);
    }

    private List<Location> OptimizeWaypointOrder(Location start, Location end, List<Location> waypoints)
    {
        // Add start and end to the list of points
        var locations = new List<Location> { start };
        locations.AddRange(waypoints);
        locations.Add(end);

// Generate all permutations of the waypoints (excluding start and end)
        var waypointPermutations = GetPermutations(waypoints, waypoints.Count).ToList();

        var optimalRoute = new List<Location>();
        double shortestDistance = double.MaxValue;

// Iterate through all permutations to find the optimal route
        foreach (var permutation in waypointPermutations)
        {
            // Add start, then the current permutation, then the end
            var route = new List<Location> { start };
            route.AddRange(permutation);
            route.Add(end);

            // Calculate the total distance for this route
            double totalDistance = CalculateTotalDistance(route);

            // If this route is shorter than the previous best, update optimalRoute
            if (totalDistance < shortestDistance)
            {
                shortestDistance = totalDistance;
                optimalRoute = new List<Location>(route);
            }
        }

        return optimalRoute;
    }
    
    private double CalculateTotalDistance(List<Location> route)
    {
        double totalDistance = 0;
        for (int i = 0; i < route.Count - 1; i++)
        {
            totalDistance += CalculateDistance(route[i], route[i + 1]);
        }
        return totalDistance;
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