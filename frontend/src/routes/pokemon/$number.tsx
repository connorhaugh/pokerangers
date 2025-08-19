import { createFileRoute } from '@tanstack/react-router'
import { Container, Typography } from '@mui/material'
import PokemonDetails from '../../components/PokemonDetails'

export const Route = createFileRoute('/pokemon/$number')({
  component: PokemonDetailsPage,
})

function PokemonDetailsPage() {
  const { number } = Route.useParams()
  
  return (
    <Container maxWidth="xl" className="py-8">
      <PokemonDetails number={parseInt(number)} />
    </Container>
  )
}