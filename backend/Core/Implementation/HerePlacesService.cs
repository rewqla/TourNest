using System.Globalization;
using Contract;
using Core.Interfaces;
using ExternalApis;
using ExternalApis.Models;
using Microsoft.Extensions.Configuration;

namespace Core.Implementation;

public class HerePlacesService : IPlacesService
{
    private readonly IHerePlacesApi _herePlacesApi;
    private readonly string _apiKey;

    public HerePlacesService(IHerePlacesApi herePlacesApi, IConfiguration configuration)
    {
        _herePlacesApi = herePlacesApi;
        _apiKey = configuration["Here:ApiKey"] ?? throw new ArgumentNullException("HERE API key is not configured");
    }

    public async Task<List<Place>> FindPlacesNearRouteAsync(
        Location startLocation,
        Location endLocation,
        List<string> categories,
        string language,
        int maxDistance = 2000)
    {
        try
        {
            var result = new List<Place>();

            // Strategy: Find places near both start and end points, and at midpoint
            var startPlaces = await FindPlacesNearPointAsync(startLocation, categories, language, maxDistance);
            var endPlaces = await FindPlacesNearPointAsync(endLocation, categories, language, maxDistance);

            // Calculate midpoint
            var midPoint = CalculateMidpoint(startLocation, endLocation);
            var midPlaces = await FindPlacesNearPointAsync(midPoint, categories, language, maxDistance);

            // Combine all places, removing duplicates by ID
            return startPlaces
                .Concat(midPlaces)
                .Concat(endPlaces)
                .GroupBy(p => p.Id)
                .Select(g => g.First())
                .ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error finding places near point: {ex.Message}");
            throw;
        }
    }

    private async Task<List<Place>> FindPlacesNearPointAsync(
        Location location,
        List<string> categories,
        string language,
        int radius)
    {
        var result = new List<Place>();

        foreach (var category in categories)
        {
            try
            {
                var coordinates = $"{location.Lat},{location.Lng}";
                var response = await _herePlacesApi.GetPlacesAsync(
                    coordinates,
                    category,
                    10,
                    radius,
                    _apiKey,
                    language);

                if (response?.Items != null)
                {
                    foreach (var item in response.Items)
                    {
                        result.Add(new Place
                        {
                            Id = item.Id,
                            Name = item.Title,
                            Address = item.Address,
                            Location = new Location
                            {
                                Lat = item.Position?.Latitude.ToString() ?? "0",
                                Lng = item.Position?.Longitude.ToString() ?? "0"
                            },
                            Categories = item.Categories,
                            Distance = item.Distance,
                            Rating = 4.0
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error finding places for category {category}: {ex.Message}");
            }
        }

        return result;
    }

    private Location CalculateMidpoint(Location start, Location end)
    {
        double lat1 = double.Parse(start.Lat, CultureInfo.InvariantCulture);
        double lng1 = double.Parse(start.Lng, CultureInfo.InvariantCulture);
        double lat2 = double.Parse(end.Lat, CultureInfo.InvariantCulture);
        double lng2 = double.Parse(end.Lng, CultureInfo.InvariantCulture);

        double midLat = (lat1 + lat2) / 2;
        double midLng = (lng1 + lng2) / 2;

        return new Location
        {
            Lat = midLat.ToString(CultureInfo.InvariantCulture),
            Lng = midLng.ToString(CultureInfo.InvariantCulture)
        };
    }
}