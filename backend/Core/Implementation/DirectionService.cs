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
        IPlacesService placesService,
        ILogger<DirectionService> logger)
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
        // Simple algorithm: sort by rating first, then by distance from route
        return places
            .OrderByDescending(p => p.Rating)
            .ThenBy(p => p.Distance)
            .Take(maxPlaces)
            .ToList();
    }
    
    private async Task<RouteResult> CreateOptimalRouteWithWaypoints(
        Location start, Location end, List<Place> places)
    {
        // Step 1: Create a list of all points in order
        var allPoints = new List<Location> { start };
        
        // Step 2: Add waypoints in optimal order
        // This is a simplified approach - for a real implementation,
        // you'd want to solve the Traveling Salesman Problem here
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
        // This is a simplified greedy algorithm:
        // Start at the starting point and always go to the nearest unvisited place
        // In a real app, you'd want a more sophisticated algorithm
        
        var result = new List<Place>();
        var unvisitedPlaces = new List<Place>(places);
        var currentPoint = start;
        
        while (unvisitedPlaces.Any())
        {
            // Find nearest unvisited place
            var nearest = unvisitedPlaces
                .OrderBy(p => CalculateDistance(
                    currentPoint.Lat, currentPoint.Lng,
                    p.Location.Lat, p.Location.Lng))
                .First();
                
            result.Add(nearest);
            unvisitedPlaces.Remove(nearest);
            currentPoint = nearest.Location;
        }
        
        return result;
    }
    
    private double CalculateDistance(string lat1, string lng1, string lat2, string lng2)
    {
        // Haversine formula for calculating distance between two coordinates
        double earthRadius = 6371000; // meters
        
        double dLat = ToRadians(double.Parse(lat2, CultureInfo.InvariantCulture) - double.Parse(lat1, CultureInfo.InvariantCulture));
        double dLng = ToRadians(double.Parse(lng2, CultureInfo.InvariantCulture) - double.Parse(lng1, CultureInfo.InvariantCulture));

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(ToRadians(double.Parse(lat1, CultureInfo.InvariantCulture))) *
                   Math.Cos(ToRadians(double.Parse(lat2, CultureInfo.InvariantCulture))) *
                   Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        
        return earthRadius * c;
    }
    
    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}