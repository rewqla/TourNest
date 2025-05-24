using Contract;
using Contract.Enums;
using Core.Models;

namespace Core.Interfaces;

public interface IDirectionService
{
    Task<DirectionResult> GetDirectionWithPlacesAsync(
        Location startLocation,
        Location endLocation,
        List<string> categories,
        RouteType routeType,
        string language,
        int maxDetourDistance = 2000,
        int maxPlacesToVisit = 4
        );
}