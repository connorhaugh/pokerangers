# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY *.sln .
COPY backend/Api/*.csproj backend/Api/
RUN dotnet restore backend/Api/Api.csproj

COPY . .
WORKDIR /src/backend/Api
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Create data directory for SQLite database
RUN mkdir -p /app/data

EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]