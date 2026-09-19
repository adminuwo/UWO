#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 Starting UWO Unified Core Service"
echo "🌐 Cloud Run PORT: ${PORT:-8080}"
echo "🐍 Internal Python Port: ${PYTHON_PORT:-8000}"
echo "=========================================================="

PYTHON_PORT="${PYTHON_PORT:-8000}"
export PYTHON_PORT
export FASTAPI_INTERNAL_URL="http://127.0.0.1:${PYTHON_PORT}"

# 1. Start Python FastAPI backend in the background on loopback 127.0.0.1
echo "📦 Starting Unified Dashboard FastAPI engine on 127.0.0.1:${PYTHON_PORT}..."
cd /usr/src/app/unified

# Ensure MONGODB_URL is exported with default Atlas URI fallback
export MONGODB_URL="${MONGODB_URL:-mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard}"
export MONGODB_URI="${MONGODB_URI:-mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard}"

# Ensure .env exists in unified
if [ ! -f .env ]; then
    if [ -f .env.txt ]; then
        cp .env.txt .env
    else
        echo "MONGODB_URL=${MONGODB_URL}" > .env
        echo "MONGODB_DB_NAME=unified_service_db" >> .env
    fi
fi

# Run with virtual environment python explicitly to avoid any PATH issues
/opt/venv/bin/python3 -m uvicorn src.main:app --host 127.0.0.1 --port "${PYTHON_PORT}" > /tmp/fastapi.log 2>&1 &
FASTAPI_PID=$!

# Trap signals to ensure graceful shutdown of child processes
cleanup() {
    echo "Shutting down services..."
    kill -TERM "$FASTAPI_PID" 2>/dev/null || true
    wait "$FASTAPI_PID" 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# 2. Wait for FastAPI to be responsive
echo "⏳ Waiting for FastAPI service to initialize..."
for i in $(seq 1 15); do
    if curl -s "http://127.0.0.1:${PYTHON_PORT}/api/health" > /dev/null 2>&1 || curl -s "http://127.0.0.1:${PYTHON_PORT}/" > /dev/null 2>&1; then
        echo "✅ FastAPI engine is online and responding."
        break
    fi
    sleep 1
done

if ! curl -s "http://127.0.0.1:${PYTHON_PORT}/api/health" > /dev/null 2>&1 && ! curl -s "http://127.0.0.1:${PYTHON_PORT}/" > /dev/null 2>&1; then
    echo "⚠️ FastAPI did not respond on 127.0.0.1:${PYTHON_PORT} after 15s. Showing /tmp/fastapi.log:"
    cat /tmp/fastapi.log || true
fi

# 3. Start Node.js Express server
echo "🚀 Starting Node.js Express Gateway and Frontend Server on port ${PORT:-8080}..."
cd /usr/src/app
exec node server.js
