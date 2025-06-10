using System.Globalization;
using System.Text.Json.Serialization;

namespace Contract;

public class Location
{
    [JsonPropertyName("lat")] public string Lat { get; set; } = string.Empty;

    [JsonPropertyName("lng")] public string Lng { get; set; } = string.Empty;
    public double GetLatInDouble() => double.Parse(Lat, CultureInfo.InvariantCulture);
    public double GetLngInDouble() => double.Parse(Lng, CultureInfo.InvariantCulture);
}