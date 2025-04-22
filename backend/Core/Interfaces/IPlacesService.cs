using ExternalApis.Models;

namespace Core.Interfaces;

public interface IPlacesService
{
    Task<PlacesResponse> GetNearbyPlacesAsync(
        double latitude, 
        double longitude, 
        string categories, 
        int radius = 1000, 
        int limit = 10);
}