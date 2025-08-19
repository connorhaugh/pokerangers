import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material'
import { Clear, Search } from '@mui/icons-material'
import { Link } from '@tanstack/react-router'
import { fetchPokemon } from '../services/pokemon'
import type { PokemonFilters } from '../services/pokemon'

const PokemonTable = () => {
  // Form filters (what user types)
  const [formFilters, setFormFilters] = useState<PokemonFilters>({
    pageNumber: 1,
    pageSize: 25,
    numberFilter: '',
    nameFilter: '',
    typeFilter: '',
    generationFilter: '',
    moveFilter: '',
    sortBy: 'number',
    sortOrder: 'asc'
  })

  // Applied filters (what's sent to API)
  const [appliedFilters, setAppliedFilters] = useState<PokemonFilters>(formFilters)

  const { data: pokemonData, isLoading, error, refetch } = useQuery({
    queryKey: ['pokemon', appliedFilters],
    queryFn: () => fetchPokemon(appliedFilters),
    refetchOnWindowFocus: false,
  })

  const handleFormFilterChange = (key: keyof PokemonFilters, value: any) => {
    const newFilters = {
      ...formFilters,
      [key]: value,
      ...(key !== 'pageNumber' && key !== 'pageSize' && key !== 'sortBy' && key !== 'sortOrder' ? { pageNumber: 1 } : {})
    }
    setFormFilters(newFilters)
    
    // For pagination and sorting, apply immediately
    if (['pageNumber', 'pageSize', 'sortBy', 'sortOrder'].includes(key)) {
      setAppliedFilters(newFilters)
    }
  }

  const handleSort = (column: string) => {
    const isCurrentColumn = appliedFilters.sortBy === column
    const newOrder = isCurrentColumn && appliedFilters.sortOrder === 'asc' ? 'desc' : 'asc'
    
    const newFilters = {
      ...formFilters,
      sortBy: column,
      sortOrder: newOrder
    }
    
    setFormFilters(newFilters)
    setAppliedFilters(newFilters)  // Apply sorting immediately
  }

  const handleSearch = () => {
    setAppliedFilters({ ...formFilters, pageNumber: 1 })
  }

  const clearFilters = () => {
    const clearedFilters = {
      pageNumber: 1,
      pageSize: 25,
      numberFilter: '',
      nameFilter: '',
      typeFilter: '',
      generationFilter: '',
      moveFilter: '',
      sortBy: 'number',
      sortOrder: 'asc'
    }
    setFormFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
  }

  const types = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy', 'Fighting', 'Poison', 'Ground', 'Flying', 'Bug', 'Rock', 'Ghost', 'Steel', 'Normal']
  const generations = ['Generation I', 'Generation II', 'Generation III', 'Generation IV', 'Generation V', 'Generation VI', 'Generation VII', 'Generation VIII']

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-8">
        <CircularProgress />
        <Typography className="ml-2" variant="body1">Loading Pokemon...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        Error loading Pokemon: {error.message}
        <button onClick={() => refetch()} className="ml-2 underline">
          Retry
        </button>
      </Alert>
    )
  }

  return (
    <Paper className="p-4">
      {/* Filters */}
      <Box className="mb-4">
        <Typography variant="h6" className="mb-3 flex items-center">
          <Search className="mr-2" />
          Filters & Search
          <IconButton onClick={clearFilters} size="small" className="ml-2">
            <Clear />
          </IconButton>
        </Typography>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Number"
              variant="outlined"
              size="small"
              value={formFilters.numberFilter || ''}
              onChange={(e) => handleFormFilterChange('numberFilter', e.target.value)}
              placeholder="e.g., 25"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              size="small"
              value={formFilters.nameFilter || ''}
              onChange={(e) => handleFormFilterChange('nameFilter', e.target.value)}
              placeholder="e.g., Pikachu"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={formFilters.typeFilter || ''}
                onChange={(e) => handleFormFilterChange('typeFilter', e.target.value)}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Generation</InputLabel>
              <Select
                value={formFilters.generationFilter || ''}
                onChange={(e) => handleFormFilterChange('generationFilter', e.target.value)}
                label="Generation"
              >
                <MenuItem value="">All Generations</MenuItem>
                {generations.map((gen) => (
                  <MenuItem key={gen} value={gen}>
                    {gen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Move"
              variant="outlined"
              size="small"
              value={formFilters.moveFilter || ''}
              onChange={(e) => handleFormFilterChange('moveFilter', e.target.value)}
              placeholder="e.g., Thunder"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<Search />}
              size="large"
              sx={{ height: '40px' }}
            >
              Search
            </Button>
          </Grid>
          </Grid>
        </form>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={appliedFilters.sortBy === 'number'}
                  direction={appliedFilters.sortBy === 'number' ? appliedFilters.sortOrder : 'asc'}
                  onClick={() => handleSort('number')}
                >
                  Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={appliedFilters.sortBy === 'name'}
                  direction={appliedFilters.sortBy === 'name' ? appliedFilters.sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={appliedFilters.sortBy === 'generation'}
                  direction={appliedFilters.sortBy === 'generation' ? appliedFilters.sortOrder : 'asc'}
                  onClick={() => handleSort('generation')}
                >
                  Generation
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={appliedFilters.sortBy === 'height'}
                  direction={appliedFilters.sortBy === 'height' ? appliedFilters.sortOrder : 'asc'}
                  onClick={() => handleSort('height')}
                >
                  Height
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={appliedFilters.sortBy === 'weight'}
                  direction={appliedFilters.sortBy === 'weight' ? appliedFilters.sortOrder : 'asc'}
                  onClick={() => handleSort('weight')}
                >
                  Weight
                </TableSortLabel>
              </TableCell>
              <TableCell>Type 1</TableCell>
              <TableCell>Type 2</TableCell>
              <TableCell>Moves Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pokemonData?.results.map((pokemon) => (
              <TableRow key={pokemon.number} hover className="cursor-pointer">
                <TableCell>{pokemon.number}</TableCell>
                <TableCell>
                  <Link 
                    to="/pokemon/$number" 
                    params={{ number: pokemon.number.toString() }}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {pokemon.name}
                  </Link>
                </TableCell>
                <TableCell>{pokemon.generation}</TableCell>
                <TableCell>{pokemon.height}</TableCell>
                <TableCell>{pokemon.weight}</TableCell>
                <TableCell>
                  <Chip label={pokemon.type1} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  {pokemon.type2 && (
                    <Chip label={pokemon.type2} size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>{pokemon.movesCount}</TableCell>
              </TableRow>
            ))}
            {pokemonData?.results.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No Pokemon found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pokemonData && (
        <TablePagination
          component="div"
          count={pokemonData.totalCount}
          page={(appliedFilters.pageNumber || 1) - 1} // MUI uses 0-based indexing
          onPageChange={(_, newPage) => handleFormFilterChange('pageNumber', newPage + 1)}
          rowsPerPage={appliedFilters.pageSize || 25}
          rowsPerPageOptions={[]}
        />
      )}
    </Paper>
  )
}

export default PokemonTable