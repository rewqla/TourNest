namespace ExternalApis.Models;

public class MapboxStep
{
    public string Name { get; set; }
    public double Distance { get; set; }
    public double Duration { get; set; }
    public MapboxManeuver Maneuver { get; set; }
}