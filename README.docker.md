# Frontend Docker Image for Rangkai Edu

This document explains how to build and use the Docker image for the Rangkai Edu frontend application.

## Docker Image Overview

The frontend application is containerized using a multi-stage Docker build process:

1. **Builder Stage**: Uses Node.js to build the React/Vite application
2. **Production Stage**: Uses Nginx to serve the built static files

The final image is optimized for size and performance, only including the necessary runtime dependencies.

## Building the Docker Image

To build the Docker image, run the following command from the frontend application directory:

```bash
docker build -t rangkaiedu-frontend:latest .
```

### Build Arguments

The following build arguments can be passed during the build process:

| Argument | Default Value | Description |
|----------|---------------|-------------|
| `VITE_BACKEND_URL` | `https://api.rangkaiedu.com/api` | Backend API URL |
| `VITE_APP_ENV` | `production` | Application environment |

To build with custom arguments:

```bash
docker build \
  --build-arg VITE_BACKEND_URL=https://staging-api.rangkaiedu.com/api \
  --build-arg VITE_APP_ENV=staging \
  -t rangkaiedu-frontend:staging .
```

## Running the Docker Container

To run the Docker container:

```bash
docker run -d -p 8080:80 --name rangkaiedu-frontend rangkaiedu-frontend:latest
```

The application will be accessible at `http://localhost:8080`.

### Environment-Specific Builds

#### Development
```bash
docker build \
  --build-arg VITE_BACKEND_URL=http://localhost:8080/api \
  --build-arg VITE_APP_ENV=development \
  -t rangkaiedu-frontend:dev .
```

#### Staging
```bash
docker build \
  --build-arg VITE_BACKEND_URL=https://staging-api.rangkaiedu.com/api \
  --build-arg VITE_APP_ENV=staging \
  -t rangkaiedu-frontend:staging .
```

#### Production
```bash
docker build \
  --build-arg VITE_BACKEND_URL=https://api.rangkaiedu.com/api \
  --build-arg VITE_APP_ENV=production \
  -t rangkaiedu-frontend:production .
```

## Deployment

The Docker image can be deployed to any container orchestration platform:

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    image: rangkaiedu-frontend:latest
    ports:
      - "80:80"
    environment:
      - VITE_BACKEND_URL=https://api.rangkaiedu.com/api
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rangkaiedu-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rangkaiedu-frontend
  template:
    metadata:
      labels:
        app: rangkaiedu-frontend
    spec:
      containers:
      - name: frontend
        image: rangkaiedu-frontend:latest
        ports:
        - containerPort: 80
```

## Nginx Configuration

The image uses a custom Nginx configuration that:

- Serves static files efficiently
- Implements proper caching headers
- Handles client-side routing for React Router
- Includes security headers

## Optimizations

- Multi-stage build reduces final image size
- Nginx Alpine image for minimal footprint
- Proper caching headers for static assets
- Gzip compression enabled
- Security headers configured

## Troubleshooting

### Common Issues

1. **Environment Variables Not Applied**: Remember that Vite environment variables must be set at build time, not runtime.

2. **Build Failures**: Ensure you're using a compatible Node.js version (>=20).

3. **Large Bundle Size**: The build process may warn about large chunks. Consider code splitting for better performance.

### Debugging

To inspect the built files in the container:
```bash
docker run -it --rm rangkaiedu-frontend:latest ls /usr/share/nginx/html
```

To check Nginx configuration:
```bash
docker run -it --rm rangkaiedu-frontend:latest cat /etc/nginx/nginx.conf