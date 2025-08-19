namespace Api.Models;

public class PokemonTablePageDto
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public List<PokemonTableRowDto> Results { get; set; } = new();
}

public class PokemonTableRowDto
{
    public int Number { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Generation { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Weight { get; set; }
    public string Type1 { get; set; } = string.Empty;
    public string? Type2 { get; set; }
    public int MovesCount { get; set; }
}