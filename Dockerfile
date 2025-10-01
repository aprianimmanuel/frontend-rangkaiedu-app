# Multi-stage Dockerfile for React/Vite frontend application

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with caching
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy application code
COPY . .

# Build arguments for environment variables (Vite variables must be available at build time)
ARG VITE_BACKEND_URL=https://api.rangkaiedu.com/api
ARG VITE_APP_ENV=production

# Set environment variables for build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Create production build
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=builder /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]