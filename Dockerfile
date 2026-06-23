FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the csproj from the root and restore it
COPY portfolio.csproj ./
RUN dotnet restore portfolio.csproj

# Copy everything else from the root and publish
COPY . ./
RUN dotnet publish portfolio.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

CMD dotnet portfolio.dll --urls "http://0.0.0.0:${PORT:-8080}"
