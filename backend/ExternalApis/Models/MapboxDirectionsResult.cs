namespace ExternalApis.Models;

public class MapboxDirectionsResult
{
    public List<MapboxRoute> Routes { get; set; } = new List<MapboxRoute>();
}