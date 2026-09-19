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
uvicorn src.main:app --host 127.0.0.1 --port "${PYTHON_PORT}" &
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
for i in $(seq 1 30); do
    if curl -s "http://127.0.0.1:${PYTHON_PORT}/docs" > /dev/null 2>&1 || curl -s "http://127.0.0.1:${PYTHON_PORT}/api" > /dev/null 2>&1; then
        echo "✅ FastAPI engine is online and responding."
        break
    fi
    sleep 1
done

# 3. Start Node.js Express server
echo "🚀 Starting Node.js Express Gateway and Frontend Server on port ${PORT:-8080}..."
cd /usr/src/app
exec node server.js
