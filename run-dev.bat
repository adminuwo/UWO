@echo off
echo ===================================================
echo Starting Unified UWO Ecosystem (100% Pure Node.js)
echo ===================================================
echo.

echo [1/4] Starting Unified Core Backend on http://localhost:8080...
start "Service 1: Unified Backend [Port 8080]" cmd /k "cd /d "%~dp0UWO\UWO-B" && npm start"
echo.

echo [2/4] Starting UWO Main Frontend on http://localhost:3000...
start "UWO Main Frontend [Port 3000]" cmd /k "cd /d "%~dp0UWO\UWO-F" && npm run dev"
echo.

echo [3/4] Starting User Dashboard Frontend on http://localhost:5173...
start "Service 2: User Dashboard [Port 5173]" cmd /k "cd /d "%~dp0user-dashboard\frontend" && npm run dev"
echo.

echo [4/4] Starting Unified Dashboard Frontend on http://localhost:5174...
start "Service 3: Unified Dashboard UI [Port 5174]" cmd /k "cd /d "%~dp0Unified-Dashboard\frontend" && npm run dev"
echo.

echo ===================================================
echo  Service 1 (Pure Node.js Unified Core):  http://localhost:8080
echo  UWO Main Website (Dev Server):          http://localhost:3000
echo  Service 2 (User Dashboard Portal):      http://localhost:5173
echo  Service 3 (Unified Dashboard UI):       http://localhost:5174
echo ===================================================
