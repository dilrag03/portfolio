FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY portfolio/portfolio.csproj portfolio/
RUN dotnet restore portfolio/portfolio.csproj

COPY portfolio/ portfolio/
RUN dotnet publish portfolio/portfolio.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

CMD dotnet portfolio.dll --urls "http://0.0.0.0:${PORT:-8080}"
