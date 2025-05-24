using Contract.Enums;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using WebApi.Models;

namespace WebApi.Endpoints;

public static class DirectionEndpoint
{
    public static void MapDirectionEndpoint(this WebApplication app)
    {
        app.MapPost("/places/direction",
            async ([FromServices] IDirectionService directionService, [FromBody] DirectionRequest request) =>
            {
                try
                {
                    var response = await directionService.GetDirectionWithPlacesAsync(
                        request.StartLocation,
                        request.EndLocation,
                        request.Categories,
                        request.RouteType,
                        request.Language,
                        request.MaxDetourDistance,
                        request.MaxPlacesToVisit
                    );

                    return Results.Ok(response);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message);
                }
            }).WithName("DirectionEndpoint");
    }
}