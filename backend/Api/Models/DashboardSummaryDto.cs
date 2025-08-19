namespace Api.Models;

public class DashboardSummaryDto
{
    public int TotalPokemonSpecies { get; set; }
    public Dictionary<string, int> PokemonCountByType { get; set; } = new();
    public Dictionary<string, int> PokemonCountByGeneration { get; set; } = new();
}