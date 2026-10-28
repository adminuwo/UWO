#!/usr/bin/env bash
# ===================================================
# 🚀 UWO Ecosystem Local Dev Launcher for macOS / Linux
# ===================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==================================================="
echo " Starting Unified UWO Ecosystem (Node.js + React)"
echo "==================================================="

# 1. Unified Core Backend (Port 8080)
echo "[1/3] Starting Unified Backend on http://localhost:8080..."
(cd "${SCRIPT_DIR}/UWO/UWO-B" && npm start) &

# 2. Unified Admin Dashboard (Port 5174)
echo "[2/3] Starting Unified Admin Dashboard on http://localhost:5174..."
(cd "${SCRIPT_DIR}/Unified-Dashboard/frontend" && npm run dev) &

# 3. Main Frontend Website (Port 3000)
echo "[3/3] Starting UWO Main Website on http://localhost:3000..."
(cd "${SCRIPT_DIR}/UWO/UWO-F" && npm run dev) &

wait
