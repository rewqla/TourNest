using Contract;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Endpoints;

public static class PlaceEndpoint
{
    public static void MapPlaceEndpoints(this WebApplication app)
    {
        app.MapGet("/places/nearby", async (
            [FromQuery] string lat,
            [FromQuery] string lng,
            [FromQuery] string categories,
            [FromQuery] int radius,
            [FromServices] IPlacesService service) =>
        {
            try
            {
                if (string.IsNullOrEmpty(lat) || string.IsNullOrEmpty(lng))
                {
                    return Results.BadRequest("Latitude and longitude are required");
                }

                if (string.IsNullOrEmpty(categories))
                {
                    return Results.BadRequest("At least one category is required");
                }

                var location = new Location { Lat = lat, Lng = lng };
                var categoryList = categories.Split(',').ToList();

                var places = await service.FindPlacesNearRouteAsync(location, location, categoryList, "en", radius);

                return Results.Ok(places);
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error retrieving places: {ex.Message}");
            }
        }).WithName("GetNearbyPlaces");
    }
}