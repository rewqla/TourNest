using ExternalApis.Models;

namespace Core.Models;

public class RouteResult
{
    public List<RouteStep> Steps { get; set; } = new List<RouteStep>();
    public Geometry Geometry { get; set; } 
    public double Distance { get; set; }
    public double Duration { get; set; }
}