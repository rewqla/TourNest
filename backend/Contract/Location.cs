using System.Text.Json.Serialization;

namespace Contract;

public class Location
{
    [JsonPropertyName("lat")]
    public string Lat { get; set; } = string.Empty;
    
    [JsonPropertyName("lng")]
    public string Lng { get; set; } = string.Empty;
}