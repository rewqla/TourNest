using Contract;
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

    [Get("/optimized-trips/v1/mapbox/{profile}/{coordinates}")]
    Task<MapboxOptimizedRouteResult> GetOptimizedRouteAsync(
        string profile,
        string coordinates,
        [AliasAs("access_token")] string accessToken,
        [AliasAs("roundtrip")] string roundtrip = "false",
        [AliasAs("source")] string source = "first",
        [AliasAs("destination")] string destination = "last",
        [AliasAs("geometries")] string geometries = "geojson");
}