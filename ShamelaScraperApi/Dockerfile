# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore dependencies
COPY ["ShamelaScraperApi.csproj", "./"]
RUN dotnet restore "ShamelaScraperApi.csproj"

# Copy the rest of the files and build
COPY . .
RUN dotnet build "ShamelaScraperApi.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "ShamelaScraperApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final Stage / Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ShamelaScraperApi.dll"]
