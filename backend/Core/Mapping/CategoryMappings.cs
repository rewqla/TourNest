namespace Core.Mapping;

public static class CategoryMappings
{
    public static readonly Dictionary<string, int> CategoryToNumber = new Dictionary<string, int>
    {
        { "restaurant", 1 },
        { "cafe", 1},
        { "atm", 7 },
        { "theatre", 2 },
        { "hotel", 5 },
        { "museum", 3 },
        { "park", 5 },
        { "shopping", 6}
    };
}