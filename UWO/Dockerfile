# ==========================================
# Stage 1: Build Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependency manifests
COPY UWO-F/package*.json ./
RUN npm ci

# Copy frontend source files
COPY UWO-F/ ./

# Build production bundle with Vite
RUN npm run build

# ==========================================
# Stage 2: Unified Production Container (Node.js + Python 3 FastAPI)
# ==========================================
FROM node:20-bookworm-slim
WORKDIR /usr/src/app

# Install system dependencies: Python 3, pip, venv, and curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Setup isolated Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Python backend dependencies
COPY UWO-B/unified/requirements.txt ./unified/requirements.txt
RUN pip install --no-cache-dir -r ./unified/requirements.txt

# Install Node.js backend production dependencies
COPY UWO-B/package*.json ./
RUN npm ci --only=production

# Copy backend source code (including unified/ and referral/)
COPY UWO-B/ ./
RUN if [ ! -f ./unified/.env ] && [ -f ./unified/.env.txt ]; then cp ./unified/.env.txt ./unified/.env; fi

# Copy all static assets from UWO-F into public folder
COPY UWO-F/ ./public/

# Overlay the compiled Vite production assets
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Clean up dev source files from the public folder
RUN rm -rf ./public/src ./public/node_modules ./public/package*.json ./public/Dockerfile ./public/vite.config.js ./public/.gitignore ./public/.dockerignore

# Copy and prepare startup script
COPY start.sh /usr/src/app/start.sh
RUN sed -i 's/\r$//' /usr/src/app/start.sh && chmod +x /usr/src/app/start.sh

# Environment settings
ENV NODE_ENV=production
ENV ENVIRONMENT=production
ENV PORT=8080
ENV PYTHON_PORT=8000
ENV MONGODB_URL="mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard"
ENV MONGODB_URI="mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard"
ENV MONGODB_DB_NAME="unified_service_db"

# Google Cloud Run default port
EXPOSE 8080

CMD ["/usr/src/app/start.sh"]
