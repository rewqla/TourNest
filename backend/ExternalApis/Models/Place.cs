using System.Text.Json.Serialization;
using Contract;

namespace ExternalApis.Models;

public class Place
{
    [JsonPropertyName("id")] public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")] public string Title { get; set; } = string.Empty;

    [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;

    [JsonPropertyName("resultType")] public string ResultType { get; set; } = string.Empty;

    [JsonPropertyName("address")] public HereAddress Address { get; set; } 

    [JsonPropertyName("position")] public Position? Position { get; set; }
    [JsonPropertyName("location")] public Location? Location { get; set; }
    [JsonPropertyName("distance")] public int Distance { get; set; }

    [JsonPropertyName("categories")] public List<Category> Categories { get; set; } = new List<Category>();

    [JsonPropertyName("rating")] public double Rating { get; set; }
}