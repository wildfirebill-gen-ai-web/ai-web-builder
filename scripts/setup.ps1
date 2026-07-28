param(
  [switch]$Install,
  [switch]$BuildDesktop
)

Write-Host "=== AI Web Builder Setup ===" -ForegroundColor Cyan

if ($Install) {
  Write-Host "`n[1/3] Installing dependencies..." -ForegroundColor Yellow
  pnpm install

  Write-Host "`n[2/3] Building packages..." -ForegroundColor Yellow
  pnpm run build --filter @awb/core --filter @awb/ui --filter @awb/config

  Write-Host "`n[3/3] Setup complete!" -ForegroundColor Green
  Write-Host "`nRun 'pnpm web' to start the web app"
  Write-Host "Run 'pnpm desktop' to start the desktop app`n"
}

if ($BuildDesktop) {
  Write-Host "`nBuilding desktop EXE..." -ForegroundColor Yellow
  Set-Location apps/desktop
  pnpm build:win
  Set-Location ../..
  Write-Host "Desktop build complete! Check apps/desktop/release/" -ForegroundColor Green
}

if (-not $Install -and -not $BuildDesktop) {
  Write-Host "`nUsage:" -ForegroundColor Yellow
  Write-Host "  .\scripts\setup.ps1 -Install       Install dependencies and build"
  Write-Host "  .\scripts\setup.ps1 -BuildDesktop  Build the Windows EXE"
  Write-Host "`nQuick start:" -ForegroundColor Cyan
  Write-Host "  .\scripts\setup.ps1 -Install"
  Write-Host "  pnpm web              # Browser app (localhost:3000)"
  Write-Host "  pnpm desktop          # Electron desktop app"
}
