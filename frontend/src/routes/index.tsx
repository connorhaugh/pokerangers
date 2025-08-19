import { createFileRoute } from '@tanstack/react-router'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { CatchingPokemon } from '@mui/icons-material'
import DashboardSummary from '../components/DashboardSummary'
import PokemonTable from '../components/PokemonTable'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <Box className="min-h-screen bg-gray-50">
      <AppBar position="static" elevation={1} className="bg-white text-black">
        <Toolbar>
          <CatchingPokemon className="text-blue-500 mr-2" fontSize="large" />
          <Typography variant="h5" component="h1" className="font-bold text-gray-900">
            PokeRangers Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" className="py-8">
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            Pokemon Dashboard
          </Typography>
        </Box>
        
        <DashboardSummary />
        
        <Box className="mt-8">
          <Typography variant="h5" className="font-bold mb-4">
            Pokemon Directory
          </Typography>
          <PokemonTable />
        </Box>
      </Container>
    </Box>
  )
}
