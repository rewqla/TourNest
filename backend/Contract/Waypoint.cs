namespace Contract;

public class Waypoint
{
    public int WaypointIndex { get; set; }
    public int TripsIndex { get; set; }
    public string Name { get; set; }
    public List<double> Location { get; set; } // [lon, lat]
}