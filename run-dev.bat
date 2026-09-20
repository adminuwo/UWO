@echo off
echo ===================================================
echo Starting Unified UWO Ecosystem (3-Tier Dev Mode)
echo ===================================================
echo.

echo [1/5] Starting Internal FastAPI Engine on http://localhost:8000...
start "FastAPI Internal Engine [Port 8000]" cmd /k "cd /d "%~dp0UWO\UWO-B\unified" && if exist .venv\Scripts\python.exe (.venv\Scripts\python.exe -m uvicorn src.main:app --port 8000 --reload) else (python -m uvicorn src.main:app --port 8000 --reload)"
echo.

echo [2/5] Starting Unified Core Backend on http://localhost:8080...
start "Service 1: Unified Backend [Port 8080]" cmd /k "cd /d "%~dp0UWO\UWO-B" && npm start"
echo.

echo [3/5] Starting UWO Main Frontend on http://localhost:3000...
start "UWO Main Frontend [Port 3000]" cmd /k "cd /d "%~dp0UWO\UWO-F" && npm run dev"
echo.

echo [4/5] Starting User Dashboard Frontend on http://localhost:5173...
start "Service 2: User Dashboard [Port 5173]" cmd /k "cd /d "%~dp0user-dashboard\frontend" && npm run dev"
echo.

echo [5/5] Starting Unified Dashboard Frontend on http://localhost:5174...
start "Service 3: Unified Dashboard UI [Port 5174]" cmd /k "cd /d "%~dp0Unified-Dashboard\frontend" && npm run dev"
echo.

echo ===================================================
echo  Service 1 (Unified Backend + UWO-F): http://localhost:8080
echo  Internal FastAPI Engine:            http://localhost:8000
echo  UWO Main Website (Dev Server):      http://localhost:3000
echo  Service 2 (User Dashboard Portal):  http://localhost:5173
echo  Service 3 (Unified Dashboard UI):   http://localhost:5174
echo ===================================================
