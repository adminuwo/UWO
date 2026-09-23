#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 Starting UWO Unified Backend (100% Pure Node.js)"
echo "🌐 Cloud Run PORT: ${PORT:-8080}"
echo "=========================================================="

cd /usr/src/app

# Default fallback URIs if not provided in Cloud Run environment
export PORT="${PORT:-8080}"
export MONGO_URI="${MONGO_URI:-mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard}"
export UNIFIED_MONGODB_URI="${UNIFIED_MONGODB_URI:-mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard}"
export UNIFIED_MONGODB_DB_NAME="${UNIFIED_MONGODB_DB_NAME:-unified_service_db}"

echo "🚀 Launching Node.js Express Gateway & Core Unified Server on port ${PORT}..."
exec node server.js
