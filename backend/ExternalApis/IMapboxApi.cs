using ExternalApis.Models;
using Refit;

namespace ExternalApis;

public interface IMapboxApi
{
    [Get("/directions/v5/mapbox/{profile}/{coordinates}")]
    Task<MapboxDirectionsResult> GetDirectionsAsync(
        string profile,
        string coordinates,
        string steps,
        string geometries,
        string language,
        string access_token);
}