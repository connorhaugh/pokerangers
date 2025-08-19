import { useQuery } from '@tanstack/react-query'
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material'
import { CatchingPokemon, Category, Stars } from '@mui/icons-material'
import { fetchDashboardSummary } from '../services/pokemon'

const DashboardSummary = () => {
  const { data: summary, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-8">
        <CircularProgress />
        <Typography className="ml-2" variant="body1">Loading summary...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        Error loading dashboard summary: {error.message}
        <button onClick={() => refetch()} className="ml-2 underline">
          Retry
        </button>
      </Alert>
    )
  }

  if (!summary) return null

  return (
    <Grid container spacing={3} className="mb-6">
      {/* Total Species Card */}
      <Grid item xs={12} md={4}>
        <Card className="h-full">
          <CardContent>
            <Box className="flex items-center">
              <CatchingPokemon className="text-blue-500 mr-2" fontSize="large" />
              <Box>
                <Typography variant="h4" className="font-bold text-blue-600">
                  {summary.totalPokemonSpecies}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Pokemon Species
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Pokemon by Type Card */}
      <Grid item xs={12} md={4}>
        <Card className="h-full">
          <CardContent>
            <Box className="flex items-center mb-3">
              <Category className="text-green-500 mr-2" fontSize="medium" />
              <Typography variant="h6" className="font-semibold">
                Pokemon by Type
              </Typography>
            </Box>
            <Box className="flex flex-wrap gap-1">
              {Object.entries(summary.pokemonCountByType).map(([type, count]) => (
                <Chip
                  key={type}
                  label={`${type}: ${count}`}
                  size="small"
                  variant="outlined"
                  className={`text-xs ${getTypeColor(type)}`}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Pokemon by Generation Card */}
      <Grid item xs={12} md={4}>
        <Card className="h-full">
          <CardContent>
            <Box className="flex items-center mb-3">
              <Stars className="text-purple-500 mr-2" fontSize="medium" />
              <Typography variant="h6" className="font-semibold">
                Pokemon by Generation
              </Typography>
            </Box>
            <Box className="flex flex-wrap gap-1">
              {Object.entries(summary.pokemonCountByGeneration).map(([generation, count]) => (
                <Chip
                  key={generation}
                  label={`${generation}: ${count}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  className="text-xs"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Helper function to get type-specific colors
const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    Fire: 'border-red-400 text-red-600',
    Water: 'border-blue-400 text-blue-600',
    Grass: 'border-green-400 text-green-600',
    Electric: 'border-yellow-400 text-yellow-600',
    Psychic: 'border-purple-400 text-purple-600',
    Ice: 'border-cyan-400 text-cyan-600',
    Dragon: 'border-indigo-400 text-indigo-600',
    Dark: 'border-gray-400 text-gray-600',
    Fairy: 'border-pink-400 text-pink-600',
    Fighting: 'border-orange-400 text-orange-600',
    Poison: 'border-violet-400 text-violet-600',
    Ground: 'border-amber-400 text-amber-600',
    Flying: 'border-sky-400 text-sky-600',
    Bug: 'border-lime-400 text-lime-600',
    Rock: 'border-stone-400 text-stone-600',
    Ghost: 'border-slate-400 text-slate-600',
    Steel: 'border-zinc-400 text-zinc-600',
    Normal: 'border-neutral-400 text-neutral-600'
  }
  
  return colors[type] || 'border-gray-400 text-gray-600'
}

export default DashboardSummary