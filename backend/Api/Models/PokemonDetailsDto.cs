namespace Api.Models;

public class PokemonDetailsDto
{
    public int Number { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Generation { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Weight { get; set; }
    public List<string> Types { get; set; } = new();
    public List<StatDto> Stats { get; set; } = new();
    public List<string> Moves { get; set; } = new();
    public List<string> Abilities { get; set; } = new();
    public EvolutionDto Evolution { get; set; } = new();
    public string Image { get; set; } = string.Empty;
}

public class StatDto
{
    public string Name { get; set; } = string.Empty;
    public int Value { get; set; }
}

public class EvolutionDto
{
    public string? From { get; set; }
    public int? FromNumber { get; set; }
    public List<string> To { get; set; } = new();
    public List<int> ToNumbers { get; set; } = new();
}