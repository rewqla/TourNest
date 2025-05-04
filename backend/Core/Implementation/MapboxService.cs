using System.Globalization;
using System.Text;
using Contract;
using Contract.Enums;
using Core.Interfaces;
using Core.Models;
using ExternalApis;
using ExternalApis.Models;
using Microsoft.Extensions.Configuration;

namespace Core.Implementation;

public class MapboxService : IMapboxService
{
    private readonly IMapboxApi _mapboxApi;
    private readonly string _apiKey;

    public MapboxService(
        IMapboxApi mapboxApi,
        IConfiguration configuration)
    {
        _mapboxApi = mapboxApi;
        _apiKey = configuration["Mapbox:ApiKey"] ?? throw new ArgumentNullException("Mapbox API key is not configured");
    }

    public async Task<RouteResult> GetRouteAsync(Location startLocation, Location endLocation)
    {
        try
        {
            var coordinates = $"{startLocation.Lng},{startLocation.Lat};{endLocation.Lng},{endLocation.Lat}";
            var response = await _mapboxApi.GetDirectionsAsync(
                "driving",
                coordinates,
                "true",
                "geojson",
                "en",
                _apiKey);

            return MapToRouteResponse(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting route from Mapbox API: {ex.Message}");
            throw;
        }
    }

    public async Task<RouteResult> GetRouteWithWaypointsAsync(List<Location> waypoints, RouteType routeType)
    {
        try
        {
            if (waypoints == null || waypoints.Count < 2)
                throw new ArgumentException("At least start and end points are required");

            var coordinatesBuilder = new StringBuilder();

            for (int i = 0; i < waypoints.Count; i++)
            {
                string lat = waypoints[i].Lat.ToString().Replace(',', '.');
                string lng = waypoints[i].Lng.ToString().Replace(',', '.');

                coordinatesBuilder.Append($"{lng},{lat}");

                if (i < waypoints.Count - 1)
                    coordinatesBuilder.Append(';');
            }

            var response = await _mapboxApi.GetDirectionsAsync(
                routeType.ToString(),
                coordinatesBuilder.ToString(),
                "true",
                "geojson",
                "en",
                _apiKey);

            return MapToRouteResponse(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting route with waypoints from Mapbox API: {ex.Message}");
            throw;
        }
    }

    public async Task<RouteResult> GetOptimizedRouteWithWaypointsAsync(List<Location> waypoints, RouteType routeType)
    {
        if (waypoints == null || waypoints.Count < 2)
            throw new ArgumentException("At least start and end points are required");

        var changedWaypoints = waypoints.Select(x => new Location
        {
            Lat = x.Lat.Replace(",", "."),
            Lng = x.Lng.Replace(",", ".")
        });

        var coordinates = string.Join(";", changedWaypoints.Select(w => $"{w.Lng},{w.Lat}"));
        var result = await _mapboxApi.GetOptimizedRouteAsync(
            profile: routeType.ToString().ToLowerInvariant(),
            coordinates: coordinates,
            accessToken: _apiKey,
            roundtrip: "false",
            source: "first",
            destination: "last",
            geometries: "geojson"
        );

        var firstTrip = result?.Trips?.FirstOrDefault();
        if (firstTrip == null)
            throw new Exception("No optimized trip returned by Mapbox");

        return new RouteResult
        {
            Distance = firstTrip.Distance,
            Duration = firstTrip.Duration,
            Geometry = firstTrip.Geometry
        };
    }

    private RouteResult MapToRouteResponse(MapboxDirectionsResult response)
    {
        if (response?.Routes == null || !response.Routes.Any())
            throw new Exception("No routes found");

        var route = response.Routes.First();

        var result = new RouteResult
        {
            Geometry = route.Geometry,
            Distance = route.Distance,
            Duration = route.Duration
        };

        if (route.Legs != null)
        {
            foreach (var leg in route.Legs)
            {
                if (leg.Steps != null)
                {
                    foreach (var step in leg.Steps)
                    {
                        result.Steps.Add(new RouteStep
                        {
                            Instruction = step.Maneuver?.Instruction ?? "",
                            Distance = step.Distance,
                            Duration = step.Duration,
                            Location = new Location
                            {
                                Lng = step.Maneuver?.Location?[0].ToString() ?? "0",
                                Lat = step.Maneuver?.Location?[1].ToString() ?? "0"
                            }
                        });
                    }
                }
            }
        }

        return result;
    }
}