# 🐳 Docker Setup Guide for Slot Swapper

This guide will help you run the entire Slot Swapper application using Docker containers.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)

## 🚀 Quick Start

### Option 1: Production Build (Recommended)
```bash
# Clone/navigate to the project
cd "slot swapper"

# Build and run all services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

**Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Option 2: Development Mode
```bash
# Run with development profile (includes hot reload)
docker-compose --profile dev up -d

# Frontend dev server will be available at http://localhost:3001
```

## 📋 Available Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| Frontend | slotswapper-frontend | 3000 | React app (production build) |
| Frontend Dev | slotswapper-frontend-dev | 3001 | React dev server with hot reload |
| Backend | slotswapper-backend | 5000 | Express.js API server |
| MongoDB | slotswapper-mongodb | 27017 | Database with auto-initialization |

## 🔧 Configuration

### Environment Variables

The docker-compose.yml includes default environment variables. For production, create a `.env` file:

```env
# Backend Configuration
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-key
MONGO_URI=mongodb://admin:password123@mongodb:27017/slotswapper?authSource=admin

# MongoDB Configuration  
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=slotswapper
```

### Database Initialization

The MongoDB container automatically:
- Creates the `slotswapper` database
- Sets up indexes for better performance
- Creates application user with proper permissions

## 🛠 Development Workflow

### Building Individual Services
```bash
# Build backend only
docker-compose build backend

# Build frontend only  
docker-compose build frontend

# Rebuild without cache
docker-compose build --no-cache
```

### Managing Services
```bash
# Start specific service
docker-compose up backend

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Restart a service
docker-compose restart backend
```

### Debugging
```bash
# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Execute commands inside containers
docker-compose exec backend sh
docker-compose exec mongodb mongosh

# Check service health
docker-compose exec backend node healthcheck.js
```

## 📊 Health Checks

The backend includes a health check endpoint:
- **URL**: http://localhost:5000/api/health
- **Returns**: Service status, uptime, and timestamp
- **Docker**: Automatic health checks every 30 seconds

## 🔒 Security Features

- **MongoDB**: Authentication enabled with custom user
- **Backend**: Non-root user in container
- **Frontend**: Nginx with security headers
- **Network**: Isolated Docker network for services

## 📁 File Structure
```
slot swapper/
├── docker-compose.yml          # Main orchestration file
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── .dockerignore          # Files to ignore
│   ├── healthcheck.js         # Health check script
│   └── mongo-init.js          # DB initialization
├── frontend/
│   ├── Dockerfile             # Frontend container config
│   ├── .dockerignore          # Files to ignore
│   └── nginx.conf             # Nginx configuration
└── README-DOCKER.md           # This file
```

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using port 3000/5000/27017
netstat -an | findstr :3000
# Kill processes or change ports in docker-compose.yml
```

**Database connection errors:**
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify database initialization
docker-compose exec mongodb mongosh --eval "show dbs"
```

**Build failures:**
```bash
# Clean Docker cache and rebuild
docker system prune -f
docker-compose build --no-cache
```

**Permission errors (Linux/Mac):**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Performance Optimization

**For development:**
- Use the `--profile dev` flag for hot reload
- Mount volumes for faster file changes

**For production:**
- Use multi-stage builds (already implemented)
- Enable nginx gzip compression (already configured)
- Consider using Docker Swarm or Kubernetes for scaling

## 🔄 Updates & Maintenance

```bash
# Update to latest images
docker-compose pull

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Update and restart services
docker-compose down
git pull
docker-compose up -d --build
```

## ✅ Success Checklist

After running `docker-compose up -d`, verify:

- [ ] All containers are running: `docker-compose ps`
- [ ] Backend health check passes: `curl http://localhost:5000/api/health`
- [ ] Frontend loads: Open http://localhost:3000
- [ ] Database is accessible: `docker-compose exec mongodb mongosh`
- [ ] API calls work: Try registering/logging in

**🎉 You're all set! Your Slot Swapper application is now running in Docker containers.**

---

For more details, see the main [README.md](./README.md) file.