#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 Starting UWO Unified Backend (100% Pure Node.js)"
echo "🌐 Cloud Run PORT: ${PORT:-8080}"
echo "=========================================================="

cd /usr/src/app

# Default fallback URIs if not provided in Cloud Run environment
export PORT="${PORT:-8080}"
export MONGO_URI="${MONGO_URI:-mongodb+srv://uwo_admin:uwo%4012345@cluster0.selr4is.mongodb.net/UWO-web?retryWrites=true&w=majority}"
export UNIFIED_MONGODB_URI="${UNIFIED_MONGODB_URI:-mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard}"
export UNIFIED_MONGODB_DB_NAME="${UNIFIED_MONGODB_DB_NAME:-unified_service_db}"

# Automatically link any keys mounted in subdirectories into /usr/src/app/keys/
mkdir -p /usr/src/app/keys
for f in /usr/src/app/keys/*/*; do
  [ -f "$f" ] && ln -sf "$f" "/usr/src/app/keys/$(basename "$f")" 2>/dev/null || true
done

echo "🚀 Launching Node.js Express Gateway & Core Unified Server on port ${PORT}..."
exec node server.js
