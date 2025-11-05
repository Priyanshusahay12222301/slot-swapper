# Frontend (React) — Complete Implementation

A complete React frontend for the Slot Swapper application with authentication, event management, and swap functionality.

## Features Implemented

✅ **Authentication System**
- Login/Signup with JWT tokens
- Protected routes with AuthContext
- Persistent login state

✅ **Pages & Components**
- Home page with welcome message
- Dashboard: Create/manage/delete events, toggle swappable status
- Marketplace: Browse and request swaps from other users
- Requests: Handle incoming/outgoing swap requests
- Responsive navbar with auth state

✅ **Event Management**
- CRUD operations for events
- Status management (BUSY/SWAPPABLE/SWAP_PENDING)
- Real-time status updates

✅ **Swap System**
- Request swaps with modal selection
- Accept/reject incoming requests
- Transaction status tracking

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Make sure backend is running on port 4000

3. Start the frontend:
```bash
npm start
```

The app will open at http://localhost:3000

## File Structure

- `src/App.js` - Main app with routing
- `src/context/AuthContext.js` - Authentication context with JWT handling
- `src/components/` - Reusable components (Navbar, ProtectedRoute)
- `src/pages/` - Main pages (Home, Login, Dashboard, Marketplace, Requests)
- `src/index.css` - Global styles with card layouts and responsive design

## Environment Variables

- `REACT_APP_API` - Backend API URL (default: http://localhost:4000/api)

## Usage Flow

1. Sign up or login
2. Create events in Dashboard
3. Mark events as "Swappable"
4. Browse Marketplace for available slots
5. Request swaps by selecting your slot
6. Handle incoming requests in Requests page
7. Swap ownership is handled atomically by backend
