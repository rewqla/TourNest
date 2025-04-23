namespace ExternalApis.Models;

public class MapboxRoute
{
    public double Distance { get; set; }
    public double Duration { get; set; }
    public List<MapboxLeg> Legs { get; set; } = new List<MapboxLeg>();
    public Geometry Geometry { get; set; } 
}