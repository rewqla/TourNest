using Contract;
using Contract.Enums;
using Core.Models;

namespace Core.Interfaces;

public interface  IMapboxService
{
    Task<RouteResult> GetRouteAsync(Location startLocation, Location endLocation);
    Task<RouteResult> GetRouteWithWaypointsAsync(List<Location> waypoints, RouteType routeType);
    Task<RouteResult> GetOptimizedRouteWithWaypointsAsync(List<Location> waypoints, RouteType routeType);
}