// API Types
export interface DashboardSummary {
  totalPokemonSpecies: number
  pokemonCountByType: Record<string, number>
  pokemonCountByGeneration: Record<string, number>
}

export interface PokemonTablePage {
  pageNumber: number
  pageSize: number
  totalCount: number
  results: Array<PokemonTableRow>
}

export interface PokemonTableRow {
  number: number
  name: string
  generation: string
  height: number
  weight: number
  type1: string
  type2: string | null
  movesCount: number
}

export interface PokemonDetails {
  number: number
  name: string
  generation: string
  height: number
  weight: number
  types: Array<string>
  stats: Array<Stat>
  moves: Array<string>
  abilities: Array<string>
  evolution: Evolution
  image: string
}

export interface Stat {
  name: string
  value: number
}

export interface Evolution {
  from: string | null
  fromNumber: number | null
  to: Array<string>
  toNumbers: Array<number>
}

// API Service Functions
const API_BASE_URL = 'http://localhost:5001'

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`)
  
  if (!response.ok) {
    throw new Error(`Dashboard API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export interface PokemonFilters {
  pageNumber?: number
  pageSize?: number
  numberFilter?: string
  nameFilter?: string
  typeFilter?: string
  generationFilter?: string
  moveFilter?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const fetchPokemon = async (filters: PokemonFilters = {}): Promise<PokemonTablePage> => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString())
    }
  })
  
  const response = await fetch(`${API_BASE_URL}/api/pokemon?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`Pokemon API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export const fetchPokemonDetails = async (number: number): Promise<PokemonDetails> => {
  const response = await fetch(`${API_BASE_URL}/api/pokemon/${number}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Pokemon not found')
    }
    throw new Error(`Pokemon details API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}