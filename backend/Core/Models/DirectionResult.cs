using ExternalApis.Models;

namespace Core.Models;

public class DirectionResult
{
    public RouteResult Route { get; set; }
    public List<Place> PlacesToVisit { get; set; } = new List<Place>();
    public double TotalDistance { get; set; }
    public double EstimatedTime { get; set; }
}