@echo off
echo ===================================================
echo Starting Unified UWO Ecosystem (Dev Mode)
echo ===================================================
echo.
echo [1/4] Starting Combined Backend on http://localhost:8080...
start "UWO Combined Backend [Port 8080]" cmd /k "cd /d "%~dp0UWO-Main\UWO-B" && npm start"
echo.
echo [2/4] Starting UWO Main Frontend on http://localhost:3000...
start "UWO Main Frontend [Port 3000]" cmd /k "cd /d "%~dp0UWO-Main\UWO-F" && npm run dev"
echo.
echo [3/4] Starting User Dashboard Frontend on http://localhost:5173...
start "User Dashboard Frontend [Port 5173]" cmd /k "cd /d "%~dp0user-dashboard\frontend" && npm run dev"
echo.
echo [4/4] Starting Unified Dashboard on http://localhost:8000...
start "Unified Dashboard [Port 8000]" cmd /k "cd /d "%~dp0Unified-Dashboard\backend" && python -m uvicorn src.main:app --port 8000 --reload"
echo.
echo ===================================================
echo  Combined Backend:        http://localhost:8080
echo  UWO Main Website:        http://localhost:3000
echo  User Referral Dashboard: http://localhost:5173
echo  Unified Dashboard:       http://localhost:8000/app/
echo ===================================================

