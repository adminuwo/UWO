Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting Unified UWO Ecosystem (100% Pure Node.js)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = $PSScriptRoot

Write-Host "[1/4] Starting Unified Core Backend on http://localhost:8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\UWO\UWO-B'; npm start"

Write-Host "[2/4] Starting UWO Main Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\UWO\UWO-F'; npm run dev"

Write-Host "[3/4] Starting User Dashboard Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\user-dashboard\frontend'; npm run dev"

Write-Host "[4/4] Starting Unified Dashboard Frontend on http://localhost:5174..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\Unified-Dashboard\frontend'; npm run dev"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Yellow
Write-Host " Service 1 (Pure Node.js Unified Core):  http://localhost:8080" -ForegroundColor White
Write-Host " UWO Main Website (Dev Server):          http://localhost:3000" -ForegroundColor White
Write-Host " Service 2 (User Dashboard Portal):      http://localhost:5173" -ForegroundColor White
Write-Host " Service 3 (Unified Dashboard UI):       http://localhost:5174" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Yellow
