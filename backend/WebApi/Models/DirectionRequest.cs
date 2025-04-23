
using Contract;

namespace WebApi.Models;

public class DirectionRequest
{
    public Location StartLocation { get; set; }
    public Location EndLocation { get; set; }
    public List<string> Categories { get; set; } 
    public int MaxDetourDistance { get; set; } = 2000; 
    public int MaxPlacesToVisit { get; set; } = 4; 
}