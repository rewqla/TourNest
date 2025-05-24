using ExternalApis.Models;
using Refit;

namespace ExternalApis
{
    public interface IHerePlacesApi
    {
        [Get("/discover")]
        Task<PlacesResponse> GetPlacesAsync(
        [Query] string at,
        [Query] string q,
        [Query] int limit,
        [Query] int radius,
        [Query] string apikey,
        [Query] string lang);
    }
}
