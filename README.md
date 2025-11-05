# 🔄 Slot Swapper — Peer-to-Peer Time Slot Exchange Platform

> **ServiceHive Technical Challenge Submission** — A complete MERN stack application for swapping time slots between users

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Priyanshusahay12222301/slot-swapper)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge&logo=vercel)](https://slot-swapper-frontend.vercel.app) *(Coming Soon)*

## 📋 **Project Overview**

**Slot Swapper** is a peer-to-peer platform that enables users to exchange time slots for various activities (meetings, appointments, reservations, etc.). Built with modern web technologies, it provides a secure and intuitive way to manage and swap time commitments.

### **Key Features**
- 🔐 **Secure Authentication** — JWT-based user authentication with bcrypt password hashing
- 📅 **Event Management** — Create, update, delete personal time slots with status management
- 🔄 **Smart Swap System** — Atomic transaction-based slot exchanges with rollback protection  
- 🛒 **Marketplace** — Browse available slots from other users and initiate swap requests
- 📬 **Request Management** — Handle incoming/outgoing swap requests with accept/reject functionality
- � **Responsive Design** — Modern UI with glass morphism effects and smooth animations
- 🐳 **Docker Ready** — Containerized setup for development and deployment
- ✅ **Tested** — Comprehensive test suite with Jest and Supertest

### **Design Choices & Architecture**

**Technology Stack:**
- **Frontend**: React 18 with Context API for state management, CSS3 with modern styling
- **Backend**: Node.js + Express.js with RESTful API design
- **Database**: MongoDB with Mongoose ODM for schema management
- **Authentication**: JSON Web Tokens (JWT) with secure middleware
- **Testing**: Jest + Supertest for API endpoint testing
- **Containerization**: Docker + Docker Compose for environment consistency

**Key Design Decisions:**
1. **Atomic Transactions**: Used Mongoose sessions to ensure swap operations are atomic (both slots transfer or neither)
2. **Status Management**: Three-state system (SWAPPABLE/BUSY/SWAP_PENDING) to prevent conflicts
3. **Context API**: Chose over Redux for simpler state management in this scope
4. **Glass Morphism UI**: Modern design trend for professional appearance
5. **Modular Architecture**: Separated concerns with clear folder structure and middleware

## 🚀 **Setup Instructions**

### **Prerequisites**
- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### **Option 1: Quick Start with Docker (Recommended)**

```bash
# 1. Clone the repository
git clone https://github.com/Priyanshusahay12222301/slot-swapper.git
cd slot-swapper

# 2. Run with Docker Compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### **Option 2: Manual Setup**

**Step 1: Clone and Install**
```bash
# Clone the repository
git clone https://github.com/Priyanshusahay12222301/slot-swapper.git
cd slot-swapper

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

**Step 2: Backend Environment Setup**
```bash
# Navigate to backend folder
cd backend

# Copy environment template
copy .env.example .env

# Edit .env file with your values:
# MONGO_URI=mongodb://localhost:27017/slotswapper
# JWT_SECRET=your-64-character-random-string
# PORT=4000
```

**Step 3: Generate JWT Secret**
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Step 4: Start the Applications**
```bash
# Terminal 1: Start Backend (from backend/ folder)
npm run dev

# Terminal 2: Start Frontend (from frontend/ folder)  
npm start
```

**Step 5: Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/api/health

## 🔗 **API Documentation**

**Base URL**: `http://localhost:4000/api`

### **Authentication Endpoints**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/signup` | Register new user | `{ name, email, password }` | `{ user, token }` |
| POST | `/login` | User login | `{ email, password }` | `{ user, token }` |
| GET | `/me` | Get current user info | None (requires token) | `{ user }` |

### **Event Management Endpoints** *(Protected - Requires Authorization Header)*

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/events` | Create new event | `{ title, startTime, endTime }` | `{ event }` |
| GET | `/events/me` | Get user's events | None | `{ events[] }` |
| PUT | `/events/:id` | Update event | `{ title?, startTime?, endTime?, status? }` | `{ event }` |
| DELETE | `/events/:id` | Delete event | None | `{ message }` |
| GET | `/events/swappable` | Get available slots for swapping | None | `{ events[] }` |

### **Swap Management Endpoints** *(Protected - Requires Authorization Header)*

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/swaps/swap-request` | Initiate swap request | `{ mySlotId, theirSlotId }` | `{ swapRequest }` |
| POST | `/swaps/swap-response/:id` | Accept/reject swap | `{ action: "accept" \| "reject" }` | `{ message, swapRequest? }` |
| GET | `/swaps/my-requests` | Get incoming/outgoing requests | None | `{ incoming[], outgoing[] }` |

### **Utility Endpoints**

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/health` | API health check | `{ status, timestamp, uptime }` |

### **Authentication**
All protected endpoints require the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **Event Status Values**
- `SWAPPABLE` - Available for swapping
- `BUSY` - Not available for swapping  
- `SWAP_PENDING` - Currently involved in pending swap request

### **Example API Usage**

```bash
# Register a new user
curl -X POST http://localhost:4000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'

# Create an event (replace <token> with actual JWT)
curl -X POST http://localhost:4000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "Team Meeting", "startTime": "2024-01-15T10:00:00Z", "endTime": "2024-01-15T11:00:00Z"}'
```

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
