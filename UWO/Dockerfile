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
# Stage 2: Unified Production Container
# ==========================================
FROM node:20-alpine
WORKDIR /usr/src/app

# Install backend production dependencies
COPY UWO-B/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY UWO-B/ ./

# Copy all static assets from UWO-F into public folder (images, admin.html, styles, scripts)
COPY UWO-F/ ./public/

# Overlay the compiled Vite production assets (compiled index.html, /assets)
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Remove unnecessary dev and source files from the public folder
RUN rm -rf ./public/src ./public/node_modules ./public/package*.json ./public/Dockerfile ./public/vite.config.js ./public/.gitignore ./public/.dockerignore

# Google Cloud Run default port
EXPOSE 8080

CMD ["npm", "start"]
