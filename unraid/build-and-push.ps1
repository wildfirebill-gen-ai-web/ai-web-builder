param(
    [string]$ImageName = "ghcr.io/wildfirebill-gen-ai-web/ai-web-builder",
    [string]$Tag = "latest",
    [switch]$Push
)

$ErrorActionPreference = "Stop"

Write-Host "=== Building AI Web Builder Docker Image ===" -ForegroundColor Cyan
Write-Host "Image: $($ImageName):$Tag" -ForegroundColor Gray

# Build the image
docker build -t "${ImageName}:${Tag}" -f ..\Dockerfile ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful." -ForegroundColor Green

if ($Push) {
    Write-Host "Pushing to $ImageName..." -ForegroundColor Cyan
    docker push "${ImageName}:${Tag}"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful." -ForegroundColor Green
    } else {
        Write-Host "Push failed. Ensure you're logged in: docker login ghcr.io" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Done." -ForegroundColor Cyan
