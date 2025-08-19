using Api.Models;
using Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Api.Services;

public interface IPokemonService
{
    DashboardSummaryDto GetDashboardSummary();
    PokemonTablePageDto GetPokemon(int pageNumber, int pageSize, string? numberFilter, string? nameFilter, string? typeFilter, string? generationFilter, string? moveFilter, string? sortBy, string? sortOrder);
    PokemonDetailsDto? GetPokemonDetails(int number);
}

public class PokemonService : IPokemonService
{
    private readonly PokemonDbContext _context;
    private readonly ILogger<PokemonService> _logger;

    public PokemonService(PokemonDbContext context, ILogger<PokemonService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public DashboardSummaryDto GetDashboardSummary()
    {
        var totalPokemon = _context.Pokemon.Count();
        
        var pokemonCountByType = _context.PokemonTypes
            .GroupBy(pt => pt.Type)
            .ToDictionary(g => g.Key, g => g.Count());
            
        var pokemonCountByGeneration = _context.Pokemon
            .GroupBy(p => p.Generation)
            .ToDictionary(g => g.Key, g => g.Count());

        return new DashboardSummaryDto
        {
            TotalPokemonSpecies = totalPokemon,
            PokemonCountByType = pokemonCountByType,
            PokemonCountByGeneration = pokemonCountByGeneration
        };
    }

    public PokemonTablePageDto GetPokemon(int pageNumber, int pageSize, string? numberFilter, string? nameFilter, string? typeFilter, string? generationFilter, string? moveFilter, string? sortBy, string? sortOrder)
    {
        var query = _context.Pokemon
            .Include(p => p.Types)
            .Include(p => p.Moves)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(numberFilter) && int.TryParse(numberFilter, out var number))
        {
            query = query.Where(p => p.Number == number);
        }

        if (!string.IsNullOrEmpty(nameFilter))
        {
            query = query.Where(p => EF.Functions.Like(p.Name.ToLower(), $"%{nameFilter.ToLower()}%"));
        }

        if (!string.IsNullOrEmpty(typeFilter))
        {
            query = query.Where(p => p.Types.Any(t => EF.Functions.Like(t.Type.ToLower(), $"%{typeFilter.ToLower()}%")));
        }

        if (!string.IsNullOrEmpty(generationFilter))
        {
            query = query.Where(p => EF.Functions.Like(p.Generation.ToLower(), $"%{generationFilter.ToLower()}%"));
        }

        if (!string.IsNullOrEmpty(moveFilter))
        {
            query = query.Where(p => p.Moves.Any(m => EF.Functions.Like(m.Move.ToLower(), $"%{moveFilter.ToLower()}%")));
        }

        // Apply sorting
        if (!string.IsNullOrEmpty(sortBy))
        {
            var isDescending = sortOrder?.ToLower() == "desc";
            query = sortBy.ToLower() switch
            {
                "number" => isDescending ? query.OrderByDescending(p => p.Number) : query.OrderBy(p => p.Number),
                "name" => isDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                "generation" => isDescending ? query.OrderByDescending(p => p.Generation) : query.OrderBy(p => p.Generation),
                "height" => isDescending ? query.OrderByDescending(p => p.Height) : query.OrderBy(p => p.Height),
                "weight" => isDescending ? query.OrderByDescending(p => p.Weight) : query.OrderBy(p => p.Weight),
                _ => query.OrderBy(p => p.Number)
            };
        }
        else
        {
            query = query.OrderBy(p => p.Number);
        }

        var totalCount = query.Count();
        var results = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PokemonTableRowDto
            {
                Number = p.Number,
                Name = p.Name,
                Generation = p.Generation,
                Height = p.Height,
                Weight = p.Weight,
                Type1 = p.Types.OrderBy(t => t.Id).Select(t => t.Type).FirstOrDefault() ?? "",
                Type2 = p.Types.OrderBy(t => t.Id).Select(t => t.Type).Skip(1).FirstOrDefault(),
                MovesCount = p.Moves.Count()
            })
            .ToList();

        return new PokemonTablePageDto
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            Results = results
        };
    }

    public PokemonDetailsDto? GetPokemonDetails(int number)
    {
        var pokemonEntity = _context.Pokemon
            .Include(p => p.Types)
            .Include(p => p.Stats)
            .Include(p => p.Moves)
            .Include(p => p.Abilities)
            .Include(p => p.Evolution)
                .ThenInclude(e => e!.ToEvolutions)
            .FirstOrDefault(p => p.Number == number);

        if (pokemonEntity == null) return null;

        // Convert entity to DTO
        return new PokemonDetailsDto
        {
            Number = pokemonEntity.Number,
            Name = pokemonEntity.Name,
            Generation = pokemonEntity.Generation,
            Height = pokemonEntity.Height,
            Weight = pokemonEntity.Weight,
            Image = pokemonEntity.Image,
            Types = pokemonEntity.Types.OrderBy(t => t.Id).Select(t => t.Type).ToList(),
            Stats = pokemonEntity.Stats.OrderBy(s => s.Id).Select(s => new StatDto { Name = s.Name, Value = s.Value }).ToList(),
            Moves = pokemonEntity.Moves.OrderBy(m => m.Id).Select(m => m.Move).ToList(),
            Abilities = pokemonEntity.Abilities.OrderBy(a => a.Id).Select(a => a.Ability).ToList(),
            Evolution = pokemonEntity.Evolution != null ? new EvolutionDto
            {
                From = pokemonEntity.Evolution.From,
                FromNumber = pokemonEntity.Evolution.FromNumber,
                To = pokemonEntity.Evolution.ToEvolutions.OrderBy(te => te.Id).Select(te => te.ToName).ToList(),
                ToNumbers = pokemonEntity.Evolution.ToEvolutions.OrderBy(te => te.Id).Select(te => te.ToNumber).ToList()
            } : new EvolutionDto()
        };
    }
}