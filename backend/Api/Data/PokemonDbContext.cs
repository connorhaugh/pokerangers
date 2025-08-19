using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data;

public class PokemonDbContext : DbContext
{
    public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
    {
    }

    public DbSet<PokemonEntity> Pokemon { get; set; }
    public DbSet<PokemonTypeEntity> PokemonTypes { get; set; }
    public DbSet<PokemonStatEntity> PokemonStats { get; set; }
    public DbSet<PokemonMoveEntity> PokemonMoves { get; set; }
    public DbSet<PokemonAbilityEntity> PokemonAbilities { get; set; }
    public DbSet<PokemonEvolutionEntity> PokemonEvolutions { get; set; }
    public DbSet<PokemonEvolutionToEntity> PokemonEvolutionsTo { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Pokemon entity
        modelBuilder.Entity<PokemonEntity>(entity =>
        {
            entity.HasKey(e => e.Number);
            entity.Property(e => e.Number).ValueGeneratedNever(); // Use Pokemon number as primary key
        });

        // Configure relationships
        modelBuilder.Entity<PokemonTypeEntity>(entity =>
        {
            entity.HasOne(e => e.Pokemon)
                  .WithMany(p => p.Types)
                  .HasForeignKey(e => e.PokemonNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PokemonStatEntity>(entity =>
        {
            entity.HasOne(e => e.Pokemon)
                  .WithMany(p => p.Stats)
                  .HasForeignKey(e => e.PokemonNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PokemonMoveEntity>(entity =>
        {
            entity.HasOne(e => e.Pokemon)
                  .WithMany(p => p.Moves)
                  .HasForeignKey(e => e.PokemonNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PokemonAbilityEntity>(entity =>
        {
            entity.HasOne(e => e.Pokemon)
                  .WithMany(p => p.Abilities)
                  .HasForeignKey(e => e.PokemonNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PokemonEvolutionEntity>(entity =>
        {
            entity.HasKey(e => e.PokemonNumber);
            entity.HasOne(e => e.Pokemon)
                  .WithOne(p => p.Evolution)
                  .HasForeignKey<PokemonEvolutionEntity>(e => e.PokemonNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PokemonEvolutionToEntity>(entity =>
        {
            entity.HasOne(e => e.Evolution)
                  .WithMany(evo => evo.ToEvolutions)
                  .HasForeignKey(e => e.PokemonNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Add indexes for better query performance
        modelBuilder.Entity<PokemonEntity>()
            .HasIndex(p => p.Name);

        modelBuilder.Entity<PokemonTypeEntity>()
            .HasIndex(pt => pt.Type);

        modelBuilder.Entity<PokemonEntity>()
            .HasIndex(p => p.Generation);

        modelBuilder.Entity<PokemonMoveEntity>()
            .HasIndex(pm => pm.Move);
    }
}