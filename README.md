# Slot Swapper — MERN Full-Stack Implementation

Complete working implementation of the Slot Swapper project (ServiceHive challenge) with Express backend and React frontend.

## 🐳 Quick Start with Docker (Recommended)

**Get up and running in 30 seconds:**

```bash
# Clone and navigate to project
cd "slot swapper"

# Run everything with Docker
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

📖 **Detailed Docker guide**: [README-DOCKER.md](./README-DOCKER.md)

## ✅ What's Implemented

**Backend (`backend/`)** — Express + Mongoose + JWT:
- User auth (signup/login) using JWT tokens
- Event model and CRUD endpoints with status management
- SwapRequest model with atomic swap transactions using Mongoose sessions
- Protected routes with auth middleware
- Complete API with proper error handling

**Frontend (`frontend/`)** — React + Context API:
- Authentication system with persistent login
- Dashboard for event management (create/update/delete/toggle status)
- Marketplace to browse and request swaps
- Requests page for handling incoming/outgoing swap requests  
- Responsive design with clean UI
- Protected routes and auth context

## 🚀 Quick Start

**Backend Setup:**
1. Open terminal in `backend/` folder
2. Copy `.env.example` to `.env` and update values:
   - `MONGO_URI` (MongoDB connection string)
   - `JWT_SECRET` (random secret key)
   - `PORT` (optional, defaults to 4000)
3. Install and start:
```powershell
npm install
npm run dev
```

**Frontend Setup:**
1. Open terminal in `frontend/` folder  
2. Install and start:
```powershell
npm install
npm start
```

**Access the app:**
- Backend API: http://localhost:4000
- Frontend: http://localhost:3000

API Endpoints (summary)

- POST `/api/signup` { name, email, password }
- POST `/api/login` { email, password }
- GET `/api/me` (protected)

- Events (protected):
  - POST `/api/events` create event { title, startTime, endTime }
  - GET `/api/events/me` list my events
  - PUT `/api/events/:id` update (title, times, status)
  - DELETE `/api/events/:id` delete
  - GET `/api/events/swappable` list others' swappable events

- Swaps (protected):
  - POST `/api/swaps/swap-request` { mySlotId, theirSlotId }
  - POST `/api/swaps/swap-response/:id` { action: 'accept'|'reject' }
  - GET `/api/swaps/my-requests` incoming & outgoing

## 📱 Usage Flow

1. **Sign up/Login** - Create account or login with existing credentials
2. **Dashboard** - Create events and mark them as swappable when available
3. **Marketplace** - Browse other users' swappable slots and request swaps
4. **Requests** - Accept/reject incoming requests and track outgoing ones
5. **Atomic Swaps** - Ownership transfers happen safely with database transactions

## 🏗️ Implementation Status

- ✅ **Phase 1-4**: Complete MERN stack with auth, events, swap logic, and modern UI
- ✅ **Phase 5**: Docker containerization for easy deployment
- ✅ **Phase 6**: Unit/Integration tests with Jest + Supertest
- ✅ **BONUS**: Production deployment configurations

## � **Deploy to Production**

**Ready to host your website? Follow these guides:**

📋 **Quick Deploy**: [QUICK-DEPLOY.md](QUICK-DEPLOY.md) *(10-minute setup)*  
📖 **Detailed Guide**: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) *(complete instructions)*

**Recommended hosting stack:**
- 🎨 **Frontend**: Vercel (free tier)
- 🖥 **Backend**: Render (free tier)  
- 💾 **Database**: MongoDB Atlas (free tier)

## 🎯 Additional Features

Implemented bonus features:
- ✅ **Docker + docker-compose** for containerized development
- ✅ **Jest + Supertest** tests for backend API endpoints
- ✅ **Production deployment** configurations and guides
- 🔄 **Socket.io** for realtime notifications *(coming next)*
