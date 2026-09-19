# =========================================================================
# Stage 1: Build Frontend SPA (React + Vite + Tailwind CSS)
# =========================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy frontend source code
COPY frontend/ ./

# Optional build-time argument for API Base URL
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production bundle (outputs to /app/dist)
RUN npm run build

# =========================================================================
# Stage 2: Production Web Server (High-Performance Nginx Alpine)
# =========================================================================
FROM nginx:alpine AS runner

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create symlink for /user path compatibility
RUN ln -s /usr/share/nginx/html /usr/share/nginx/html/user || true

# Copy Nginx configuration template and entrypoint script
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY entrypoint.sh /entrypoint.sh

# Ensure script has Linux line endings (prevent Windows CRLF issues) and execute permissions
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Cloud Run default port
ENV PORT=8080

EXPOSE 8080

# Run entrypoint to configure dynamic port, generate env-config.js, and launch Nginx
ENTRYPOINT ["/entrypoint.sh"]
