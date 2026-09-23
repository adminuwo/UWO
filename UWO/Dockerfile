# ==============================================================================
# UWO Unified Production Container - 100% Pure Node.js (Single Port 8080)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build UWO Main Frontend (React + Vite)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY UWO-F/package*.json ./
RUN npm ci

COPY UWO-F/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Pure Node.js Production Container (Port 8080)
# ------------------------------------------------------------------------------
FROM node:20-bookworm-slim
WORKDIR /usr/src/app

# Install minimal essential tools (curl for healthchecks, ca-certificates)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js production dependencies
COPY UWO-B/package*.json ./
RUN npm ci --omit=dev

# Copy backend source code (Express server, unified_routes, referral, affiliate, keys)
COPY UWO-B/ ./

# Copy static assets from UWO-F and overlay built frontend bundle into public/
COPY UWO-F/ ./public/
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Clean up dev artifacts from public folder
RUN rm -rf ./public/src ./public/node_modules ./public/package*.json ./public/Dockerfile ./public/vite.config.js ./public/.gitignore ./public/.dockerignore

# Copy and setup startup script
COPY start.sh /usr/src/app/start.sh
RUN sed -i 's/\r$//' /usr/src/app/start.sh && chmod +x /usr/src/app/start.sh

# Environment settings (Single Port 8080)
ENV NODE_ENV=production
ENV ENVIRONMENT=production
ENV PORT=8080
ENV MONGO_URI="mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard"
ENV UNIFIED_MONGODB_URI="mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard"
ENV UNIFIED_MONGODB_DB_NAME="unified_service_db"

# Cloud Run default port
EXPOSE 8080

CMD ["/usr/src/app/start.sh"]
