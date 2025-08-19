.PHONY: help dev.up dev.down dev.logs dev.build prod.up prod.down prod.build clean

# Default target
help:
	@echo "Available commands:"
	@echo "  dev.up      - Start development environment with hot reload"
	@echo "  dev.down    - Stop development environment"
	@echo "  dev.logs    - Show development logs"
	@echo "  dev.build   - Build development containers"
	@echo "  prod.up     - Start production environment"
	@echo "  prod.down   - Stop production environment"
	@echo "  prod.build  - Build production containers"
	@echo "  clean       - Clean up all containers, images, and volumes"

# Development commands
dev.up:
	@echo "🚀 Starting development environment..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:5001"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"

dev.down:
	@echo "🛑 Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Development environment stopped!"

dev.logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev.build:
	@echo "🔨 Building development containers..."
	docker-compose -f docker-compose.dev.yml build --no-cache
	@echo "✅ Development containers built!"

# Production commands
prod.up:
	@echo "🚀 Starting production environment..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:5001"
	docker-compose up -d
	@echo "✅ Production environment started!"

prod.down:
	@echo "🛑 Stopping production environment..."
	docker-compose down
	@echo "✅ Production environment stopped!"

prod.build:
	@echo "🔨 Building production containers..."
	docker-compose build --no-cache
	@echo "✅ Production containers built!"

# Utility commands
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans 2>/dev/null || true
	docker-compose down -v --rmi all --remove-orphans 2>/dev/null || true
	docker system prune -f
	@echo "✅ Cleanup complete!"