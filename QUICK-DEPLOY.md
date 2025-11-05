# 🚀 Quick Deployment Checklist

## Pre-Deployment Setup

### 1. 🍃 MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create new cluster (M0 Sandbox - Free)
- [ ] Create database user with read/write permissions  
- [ ] Add IP address `0.0.0.0/0` to Network Access
- [ ] Copy connection string and replace `<password>` with actual password
- [ ] Add `/slotswapper` database name before `?retryWrites`

**Final connection string format:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
```

### 2. 🔑 Generate JWT Secret
```bash
# Run this command to generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Backend Deployment (Render)

### 3. 🖥 Deploy to Render
- [ ] Create Render account and connect GitHub
- [ ] Create new Web Service
- [ ] Select your repository
- [ ] Configure:
  - **Name**: `slotswapper-backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Root Directory**: `backend`

### 4. 🔧 Add Environment Variables in Render
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=your-64-character-jwt-secret-from-step-2
```

### 5. ✅ Test Backend
- [ ] Wait for deployment to complete
- [ ] Visit: `https://your-backend-name.onrender.com/api/health`
- [ ] Should return: `{"status":"healthy","timestamp":"...","uptime":...}`

## Frontend Deployment (Vercel)

### 6. 🎨 Deploy to Vercel  
- [ ] Create Vercel account and connect GitHub
- [ ] Import your repository
- [ ] Configure:
  - **Framework**: `Create React App`
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `build`

### 7. 🔧 Add Environment Variables in Vercel
```env
REACT_APP_API_URL=https://your-backend-name.onrender.com/api
```
*(Replace `your-backend-name` with your actual Render service name)*

### 8. 🔒 Update CORS (Important!)
Update `backend/app.js` and redeploy:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://your-frontend-name.vercel.app' // Production
  ],
  credentials: true
}));
```

## Final Testing

### 9. 🧪 Complete Application Test
- [ ] Visit your Vercel frontend URL
- [ ] Create a new account (test signup)
- [ ] Login with the account
- [ ] Create a new event
- [ ] Make it swappable
- [ ] Test marketplace functionality
- [ ] Check requests page

## 🎉 Success!

**Your live URLs:**
- 🌐 **Frontend**: `https://your-app.vercel.app`
- 🔌 **Backend**: `https://your-backend.onrender.com`
- 💾 **Database**: MongoDB Atlas

---

## 🚨 Common Issues & Fixes

**CORS Error**: Update backend CORS with your frontend URL  
**API Not Found**: Check `REACT_APP_API_URL` includes `/api` at the end  
**Database Error**: Verify MongoDB connection string and network access  
**Build Failure**: Check Node.js version compatibility

**Need help?** Check the complete [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)