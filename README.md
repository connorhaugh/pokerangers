# PokeRangers - Pokemon Dashboard Application

A full-stack web application for browsing and managing Pokemon datas. I hope you enjoy! I have only used C# for Unity development so I leaned heavily on the most well-trodden paths for frameworks and choices.

## Requirements

### System Requirements
- **Docker** & **Docker Compose** (recommended)
- **Node.js** 18+ (for local development)
- **.NET 9.0** (for local development)

## Quick Start

### Option 1: Docker (Recommended because who knows what you have going on) (make sure you don't have anything else on ports ;> )

1. **Clone the repository**
   ```bash
   git clone git@github.com:connorhaugh/pokerangers.git
   cd pokerangers
   ```

2. **Start development environment**
   ```bash 
   make dev.up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Swagger API docs: http://localhost:5001/swagger

4. **Stop the environment**
   ```bash
   make dev.down
   ```

## Live Demo can be viewed at
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Documentation**: http://localhost:5001/swagger

### Option 2: Local Development

#### Prerequisites
```bash
# Install Node.js dependencies
cd frontend
npm install

# Restore .NET packages
cd ../backend/Api
dotnet restore
```

#### Run Backend
```bash
cd backend/Api
dotnet run
```

#### Run Frontend
```bash
cd frontend
npm run dev
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TanStack Router** for routing
- **TanStack Query** for data fetching
- **Material-UI (MUI)** for components
- **Tailwind CSS** for styling

### Backend
- **.NET 9.0** with ASP.NET Core
- **Entity Framework Core** with SQLite for persistance
- **Swagger/OpenAPI** for documentation
- **Docker** containerization

### Database
- **SQLite** for data persistence
- **Entity Framework** migrations
- **Seeded data** from JSON file provided.

## Architecture & Approach

### Frontend Architecture
- **Component-Based**: Modular React components with TypeScript
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: File-based routing with TanStack Router
- **Styling**: Material-UI components with Tailwind CSS utilities
- **Data Fetching**: Centralized API services with error handling

### Backend Architecture
- **Repository Pattern**: Service layer abstracts data access
- **Database First**: Entity Framework with code-first migrations
- **Dependency Injection**: Built-in .NET DI container
- **Error Handling**: Global exception handling and logging

### Key Design Decisions
1. **Microservice Ready**: Containerized services with Docker
2. **Type Safety**: Full TypeScript coverage and .NET strong typing
3. **Performance**: Search button approach, pagination, lazy loading
4. **User Experience**: Material-UI for consistent, accessible design
5. **Developer Experience**: Hot reload, linting, structured logging

## Scalability Considerations

### Current Implementation
- **SQLite Database**: Suitable for demo/development
- **In-Memory Caching**: Basic query optimization
- **Client-Side Pagination**: Reduces server load
- **Container Orchestration**: Docker Compose for multi-service deployment

### Horizontal Scaling Opportunities
1. **Database Migration**
   - PostgreSQL/MySQL for production, or even moving beyond ACID to SAGA pattern for giant scale work with Nosql kv stores 
   - Database sharding for large datasets

2. **Caching Layer**
   - Redis for distributed caching of requests (people will often pull the data for the no filter case, etc)
   - CDN for static assets (for image links)
   - Application-level caching

3. **API Scaling**
   - Load balancer (nginx/HAProxy)
   - Multiple API instances
   - Rate limiting and throttling need to be implemented

4. **Frontend Optimization**
   - Static site generation (SSG)
   - Edge deployment (Vercel/Netlify)

### Performance Optimizations Implemented
- Database indexing on searchable fields
- Search button approach (no auto-reload while typing)
- Pagination with efficient queries
- Component memoization
- Case-insensitive search with SQL LIKE

## =. Future Improvements

### Short Term (1-2 sprints)
- [ ] **Integration Tests**: Round-trip testing with cypress, etc. 
- [ ] **A11Y**: Accessibility is key
- [ ] **Loading States**: Skeleton screens and better UX around search
- [ ] **Typing**: Types from the backend are exported for import use in the frontend.
- [ ] **Monorepo Build Stuff**: There is more to be looked at to make sure that the backend hot-reloads better on changes. Things like Pants are great for python monorepos.
- [ ] **Data Import**: Add more data via CSV import
- [ ] **Data Export**: CSV/PDF export functionality


## >� Testing Strategy

### Current Testing
- ESLint for code quality
- TypeScript for type safety
- Docker health checks

### Planned Testing
```bash
# Frontend
npm run test          # Jest unit tests
npm run test:e2e      # integration tests
npm run test:coverage # Coverage reports

# Backend
dotnet test           # xUnit tests
dotnet test --coverage # Coverage reports
```

## Monitoring & Observability

### Implemented
- Structured logging (.NET)
- Docker health checks
- API error responses

## License?

This project is created for demonstration purposes as part of a software engineering job application. Don't sue me nintendo

---

**Built with care for Kalderos by Connor**
