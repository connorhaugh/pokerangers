using Api.Models;
using Api.Services;
using Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=pokemon.db"));

builder.Services.AddScoped<IPokemonService, PokemonService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PokemonDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Ensure database directory exists
        var connectionString = app.Configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(connectionString) && connectionString.StartsWith("Data Source="))
        {
            var dbPath = connectionString.Substring("Data Source=".Length);
            var dbDirectory = Path.GetDirectoryName(dbPath);
            if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
            {
                Directory.CreateDirectory(dbDirectory);
                logger.LogInformation("Created database directory: {Directory}", dbDirectory);
            }
        }
        
        context.Database.EnsureCreated();
        logger.LogInformation("Database initialized successfully");
        
        // Seed database if empty
        if (!context.Pokemon.Any())
        {
            logger.LogInformation("Database is empty, starting seeding process...");
            await SeedDatabaseFromJson(context, app.Environment);
        }
        else
        {
            logger.LogInformation("Database already contains {Count} Pokemon", context.Pokemon.Count());
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error initializing database");
        throw;
    }
}

// Configure the HTTP request pipeline.
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI();
}

// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Dashboard Endpoints
app.MapGet("/api/dashboard/summary", (IPokemonService pokemonService) =>
{
    return pokemonService.GetDashboardSummary();
})
.WithName("GetDashboardSummary")
.WithTags("Dashboard")
.Produces<DashboardSummaryDto>();

// Pokemon Table Endpoint
app.MapGet("/api/pokemon", (
    IPokemonService pokemonService,
    int pageNumber = 1,
    int pageSize = 25,
    string? numberFilter = null,
    string? nameFilter = null,
    string? typeFilter = null,
    string? generationFilter = null,
    string? moveFilter = null,
    string? sortBy = null,
    string? sortOrder = null) =>
{
    return pokemonService.GetPokemon(pageNumber, pageSize, numberFilter, nameFilter, typeFilter, generationFilter, moveFilter, sortBy, sortOrder);
})
.WithName("GetPokemon")
.WithTags("Pokemon")
.Produces<PokemonTablePageDto>();

// Pokemon Details Endpoint
app.MapGet("/api/pokemon/{number:int}", (IPokemonService pokemonService, int number) =>
{
    var pokemon = pokemonService.GetPokemonDetails(number);
    return pokemon is not null ? Results.Ok(pokemon) : Results.NotFound();
})
.WithName("GetPokemonDetails")
.WithTags("Pokemon")
.Produces<PokemonDetailsDto>()
.Produces(404);

app.Run();

// Database seeding function
static async Task SeedDatabaseFromJson(PokemonDbContext context, IWebHostEnvironment environment)
{
    var baseDir = AppContext.BaseDirectory;
    var jsonPath = Path.Combine(baseDir, "static", "pokemon_.json");
    
    if (!File.Exists(jsonPath))
    {
        Console.WriteLine($"Pokemon JSON file not found at {jsonPath}");
        return;
    }

    var jsonContent = await File.ReadAllTextAsync(jsonPath);
    var pokemonList = System.Text.Json.JsonSerializer.Deserialize<List<PokemonDetailsDto>>(jsonContent, new System.Text.Json.JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    });

    if (pokemonList == null || pokemonList.Count == 0)
    {
        Console.WriteLine("Pokemon JSON file is empty or invalid");
        return;
    }

    Console.WriteLine($"Seeding database with {pokemonList.Count} Pokemon...");

    var pokemonEntities = new List<PokemonEntity>();
    var pokemonNameToNumber = pokemonList.ToDictionary(p => p.Name.ToLowerInvariant(), p => p.Number);

    foreach (var pokemon in pokemonList)
    {
        var entity = new PokemonEntity
        {
            Number = pokemon.Number,
            Name = pokemon.Name ?? "",
            Generation = pokemon.Generation ?? "",
            Height = pokemon.Height,
            Weight = pokemon.Weight,
            Image = pokemon.Image ?? "",
            Types = pokemon.Types?.Select(t => new PokemonTypeEntity { Type = t }).ToList() ?? new List<PokemonTypeEntity>(),
            Stats = pokemon.Stats?.Select(s => new PokemonStatEntity { Name = s.Name, Value = s.Value }).ToList() ?? new List<PokemonStatEntity>(),
            Moves = pokemon.Moves?.Select(m => new PokemonMoveEntity { Move = m }).ToList() ?? new List<PokemonMoveEntity>(),
            Abilities = pokemon.Abilities?.Select(a => new PokemonAbilityEntity { Ability = a }).ToList() ?? new List<PokemonAbilityEntity>()
        };

        // Handle evolution
        var evolution = new PokemonEvolutionEntity
        {
            PokemonNumber = pokemon.Number,
            From = pokemon.Evolution?.From
        };

        // Look up FromNumber
        if (!string.IsNullOrWhiteSpace(pokemon.Evolution?.From))
        {
            if (pokemonNameToNumber.TryGetValue(pokemon.Evolution.From.ToLowerInvariant(), out var fromNumber))
            {
                evolution.FromNumber = fromNumber;
            }
        }

        // Handle To evolutions
        var toEvolutions = new List<PokemonEvolutionToEntity>();
        if (pokemon.Evolution?.To != null)
        {
            foreach (var toName in pokemon.Evolution.To)
            {
                if (!string.IsNullOrWhiteSpace(toName) && pokemonNameToNumber.TryGetValue(toName.ToLowerInvariant(), out var toNumber))
                {
                    toEvolutions.Add(new PokemonEvolutionToEntity
                    {
                        PokemonNumber = pokemon.Number,
                        ToName = toName,
                        ToNumber = toNumber
                    });
                }
            }
        }

        evolution.ToEvolutions = toEvolutions;
        entity.Evolution = evolution;

        pokemonEntities.Add(entity);
    }

    // Add to context
    context.Pokemon.AddRange(pokemonEntities);
    await context.SaveChangesAsync();

    Console.WriteLine($"Successfully seeded database with {pokemonEntities.Count} Pokemon");
}
