using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models;

[Table("Pokemon")]
public class PokemonEntity
{
    [Key]
    public int Number { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Generation { get; set; } = string.Empty;
    
    public int Height { get; set; }
    public int Weight { get; set; }
    
    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;
    
    // Navigation properties
    public List<PokemonTypeEntity> Types { get; set; } = new();
    public List<PokemonStatEntity> Stats { get; set; } = new();
    public List<PokemonMoveEntity> Moves { get; set; } = new();
    public List<PokemonAbilityEntity> Abilities { get; set; } = new();
    public PokemonEvolutionEntity? Evolution { get; set; }
}

[Table("PokemonTypes")]
public class PokemonTypeEntity
{
    [Key]
    public int Id { get; set; }
    
    public int PokemonNumber { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Type { get; set; } = string.Empty;
    
    // Navigation property
    [ForeignKey("PokemonNumber")]
    public PokemonEntity Pokemon { get; set; } = null!;
}

[Table("PokemonStats")]
public class PokemonStatEntity
{
    [Key]
    public int Id { get; set; }
    
    public int PokemonNumber { get; set; }
    
    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = string.Empty;
    
    public int Value { get; set; }
    
    // Navigation property
    [ForeignKey("PokemonNumber")]
    public PokemonEntity Pokemon { get; set; } = null!;
}

[Table("PokemonMoves")]
public class PokemonMoveEntity
{
    [Key]
    public int Id { get; set; }
    
    public int PokemonNumber { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Move { get; set; } = string.Empty;
    
    // Navigation property
    [ForeignKey("PokemonNumber")]
    public PokemonEntity Pokemon { get; set; } = null!;
}

[Table("PokemonAbilities")]
public class PokemonAbilityEntity
{
    [Key]
    public int Id { get; set; }
    
    public int PokemonNumber { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Ability { get; set; } = string.Empty;
    
    // Navigation property
    [ForeignKey("PokemonNumber")]
    public PokemonEntity Pokemon { get; set; } = null!;
}

[Table("PokemonEvolutions")]
public class PokemonEvolutionEntity
{
    [Key]
    public int PokemonNumber { get; set; }
    
    [MaxLength(100)]
    public string? From { get; set; }
    
    public int? FromNumber { get; set; }
    
    // Navigation property
    [ForeignKey("PokemonNumber")]
    public PokemonEntity Pokemon { get; set; } = null!;
    
    // Evolution "To" relationships
    public List<PokemonEvolutionToEntity> ToEvolutions { get; set; } = new();
}

[Table("PokemonEvolutionsTo")]
public class PokemonEvolutionToEntity
{
    [Key]
    public int Id { get; set; }
    
    public int PokemonNumber { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string ToName { get; set; } = string.Empty;
    
    public int ToNumber { get; set; }
    
    // Navigation property
    [ForeignKey("PokemonNumber")]
    public PokemonEvolutionEntity Evolution { get; set; } = null!;
}