using Core.Interfaces;

namespace WebApi.Endpoints;

public static class PlaceEndpoints
{
    public static void MapPlaceEndpoints(this WebApplication app)
    {
        app.MapGet("/places/nearby", async (IPlacesService service, double lat, double lon, string category) =>
        {
            var response = await service.GetNearbyPlacesAsync(lat, lon, category);

            if (response == null)
                return Results.Problem("Failed to retrieve places from HERE API.");

            return Results.Ok(response);
        }).WithName("GetNearbyPlaces");
    }
}