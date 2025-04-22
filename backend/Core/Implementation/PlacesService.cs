using System.Globalization;
using Core.Interfaces;
using ExternalApis;
using ExternalApis.Models;
using Microsoft.Extensions.Configuration;

namespace Core.Implementation;

public class PlacesService : IPlacesService
{
    private readonly IHerePlacesApi _herePlacesApi;
    private readonly string _apiKey;
    
    public PlacesService(IHerePlacesApi herePlacesApi, IConfiguration configuration)
    {
        _herePlacesApi = herePlacesApi;
        _apiKey = configuration["HereApi:ApiKey"]!;
    }

    public async Task<PlacesResponse> GetNearbyPlacesAsync(double latitude, double longitude, string categories,
        int radius = 1000, int limit = 10)
    {
        string coordinates = $"{latitude.ToString(CultureInfo.InvariantCulture)},{longitude.ToString(CultureInfo.InvariantCulture)}";
            
        return await _herePlacesApi.GetPlacesAsync(
            coordinates, 
            categories, 
            limit, 
            radius,
            _apiKey);
    }
}