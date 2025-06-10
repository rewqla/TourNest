using Contract;
using ExternalApis.Models;

namespace Core.Interfaces;

public interface IPlacesService
{
    Task<List<Place>> FindPlacesNearRouteAsync(
        Location startLocation,
        Location endLocation,
        List<string> categories,
        string language,
        int maxDistance = 2000);
}