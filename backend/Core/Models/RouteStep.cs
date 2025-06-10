using Contract;

namespace Core.Models;

public class RouteStep
{
    public string Instruction { get; set; }
    public double Distance { get; set; }
    public double Duration { get; set; }
    public Location Location { get; set; }
}