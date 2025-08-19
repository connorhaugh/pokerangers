import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography
} from '@mui/material'
import { ArrowBack, FitnessCenter, Healing, Height, Psychology, Shield, Speed } from '@mui/icons-material'
import { Link, useNavigate } from '@tanstack/react-router'
import { fetchPokemonDetails } from '../services/pokemon'

interface PokemonDetailsProps {
  number: number
}

const PokemonDetails = ({ number }: PokemonDetailsProps) => {
  const navigate = useNavigate()
  
  const { data: pokemon, isLoading, error, refetch } = useQuery({
    queryKey: ['pokemon-details', number],
    queryFn: () => fetchPokemonDetails(number),
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-8">
        <CircularProgress />
        <Typography className="ml-2" variant="body1">Loading Pokemon details...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        Error loading Pokemon details: {error.message}
        <button onClick={() => refetch()} className="ml-2 underline">
          Retry
        </button>
      </Alert>
    )
  }

  if (!pokemon) return null

  const getStatIcon = (statName: string) => {
    switch (statName.toLowerCase()) {
      case 'hp': return <Healing className="text-red-500" />
      case 'attack': return <FitnessCenter className="text-orange-500" />
      case 'defense': return <Shield className="text-blue-500" />
      case 'speed': return <Speed className="text-yellow-500" />
      default: return <Psychology className="text-purple-500" />
    }
  }

  const getStatColor = (value: number) => {
    if (value >= 80) return 'success'
    if (value >= 60) return 'warning'
    return 'error'
  }

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      Fire: 'bg-red-100 text-red-800 border-red-200',
      Water: 'bg-blue-100 text-blue-800 border-blue-200',
      Grass: 'bg-green-100 text-green-800 border-green-200',
      Electric: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Psychic: 'bg-purple-100 text-purple-800 border-purple-200',
      Ice: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      Dragon: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Dark: 'bg-gray-100 text-gray-800 border-gray-200',
      Fairy: 'bg-pink-100 text-pink-800 border-pink-200',
      Fighting: 'bg-orange-100 text-orange-800 border-orange-200',
      Poison: 'bg-violet-100 text-violet-800 border-violet-200',
      Ground: 'bg-amber-100 text-amber-800 border-amber-200',
      Flying: 'bg-sky-100 text-sky-800 border-sky-200',
      Bug: 'bg-lime-100 text-lime-800 border-lime-200',
      Rock: 'bg-stone-100 text-stone-800 border-stone-200',
      Ghost: 'bg-slate-100 text-slate-800 border-slate-200',
      Steel: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      Normal: 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
    
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <Box className="max-w-6xl mx-auto">
      {/* Header */}
      <Box className="mb-4 flex items-center justify-between">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate({ to: '/' })}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" className="font-bold text-center flex-1">
          #{pokemon.number.toString().padStart(3, '0')} {pokemon.name}
        </Typography>
        <Box className="w-24" /> {/* Spacer for centering */}
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Basic Info & Image */}
        <Grid item xs={12} md={6}>
          <Card className="mb-4">
            <CardContent>
              <Box className="text-center mb-4">
                <Avatar
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="mx-auto mb-4"
                  sx={{ width: 200, height: 200 }}
                />
                <Typography variant="h5" className="font-bold mb-2">
                  {pokemon.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" className="mb-3">
                  {pokemon.generation}
                </Typography>
                
                {/* Types */}
                <Box className="flex justify-center gap-2 mb-4">
                  {pokemon.types.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      className={`font-medium ${getTypeColor(type)}`}
                    />
                  ))}
                </Box>

                {/* Physical Stats */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box className="flex items-center justify-center">
                      <Height className="text-gray-600 mr-1" />
                      <Typography variant="body2">
                        <strong>{pokemon.height}</strong> height
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="flex items-center justify-center">
                      <FitnessCenter className="text-gray-600 mr-1" />
                      <Typography variant="body2">
                        <strong>{pokemon.weight}</strong> weight
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Evolution */}
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-3">
                Evolution Chain
              </Typography>
              
              <Box className="space-y-2">
                {pokemon.evolution.from && pokemon.evolution.fromNumber && (
                  <Typography variant="body2">
                    <strong>Evolves from:</strong>{' '}
                    <Link
                      to="/pokemon/$number"
                      params={{ number: pokemon.evolution.fromNumber.toString() }}
                      className="text-blue-600 hover:underline"
                    >
                      {pokemon.evolution.from}
                    </Link>
                  </Typography>
                )}
                
                {pokemon.evolution.to.length > 0 && (
                  <Typography variant="body2">
                    <strong>Evolves to:</strong>{' '}
                    {pokemon.evolution.to.map((evolutionName, index) => (
                      <span key={evolutionName}>
                        {pokemon.evolution.toNumbers[index] ? (
                          <Link
                            to="/pokemon/$number"
                            params={{ number: pokemon.evolution.toNumbers[index].toString() }}
                            className="text-blue-600 hover:underline"
                          >
                            {evolutionName}
                          </Link>
                        ) : (
                          <span className="text-gray-600">{evolutionName}</span>
                        )}
                        {index < pokemon.evolution.to.length - 1 && ', '}
                      </span>
                    ))}
                  </Typography>
                )}
                
                {!pokemon.evolution.from && pokemon.evolution.to.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Does not evolve
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Stats & Details */}
        <Grid item xs={12} md={6}>
          {/* Stats */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-3">
                Base Stats
              </Typography>
              
              {pokemon.stats.map((stat) => (
                <Box key={stat.name} className="mb-3">
                  <Box className="flex items-center justify-between mb-1">
                    <Box className="flex items-center">
                      {getStatIcon(stat.name)}
                      <Typography variant="body2" className="ml-2 font-medium">
                        {stat.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="font-bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((stat.value / 150) * 100, 100)} // Normalize to 150 max
                    color={getStatColor(stat.value)}
                    className="h-2 rounded"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Abilities */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-3">
                Abilities
              </Typography>
              
              <Box className="flex flex-wrap gap-1">
                {pokemon.abilities.map((ability) => (
                  <Chip
                    key={ability}
                    label={ability}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Moves */}
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-3">
                Moves ({pokemon.moves.length})
              </Typography>
              
              <Box className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                {pokemon.moves.map((move) => (
                  <Chip
                    key={move}
                    label={move}
                    variant="outlined"
                    size="small"
                    className="m-0.5"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PokemonDetails