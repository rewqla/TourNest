using Contract;
using Core.Models;

namespace Core.Interfaces;

public interface  IMapboxService
{
    Task<RouteResult> GetRouteAsync(Location startLocation, Location endLocation);
    Task<RouteResult> GetRouteWithWaypointsAsync(List<Location> waypoints);
}