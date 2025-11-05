# 🔧 Environment Variables Setup Guide

## 📍 **Frontend Environment Variables**

### **Local Development (`.env` file)**

**Location**: `frontend/.env`

```bash
# Local Development Backend API URL
REACT_APP_API_URL=http://localhost:4000/api
```

✅ **Already configured!** This file exists and connects to your local backend.

---

### **Production Deployment (Vercel)**

When deploying to Vercel, you need to add environment variables in the Vercel Dashboard:

**Step 1: Go to Vercel Dashboard**
1. Open your project: https://vercel.com/dashboard
2. Click on your deployed project
3. Go to **Settings** → **Environment Variables**

**Step 2: Add Environment Variable**

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-name.onrender.com/api` | Production, Preview, Development |

**Example Values:**

```bash
# If your backend is NOT deployed yet (for testing):
REACT_APP_API_URL=http://localhost:4000/api

# When your backend is deployed on Render:
REACT_APP_API_URL=https://slot-swapper-backend.onrender.com/api
```

**Step 3: Redeploy**
- After adding the environment variable, click **Redeploy** in Vercel
- Or push a new commit to GitHub (Vercel auto-deploys)

---

## 🖥️ **Backend Environment Variables**

### **Local Development (`.env` file)**

**Location**: `backend/.env`

```bash
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/slotswapper
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Port
PORT=4000

# Node Environment
NODE_ENV=development
```

**Generate JWT Secret:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### **Production Deployment (Render)**

When deploying to Render, add these environment variables:

**Go to Render Dashboard:**
1. Open your service: https://render.com/dashboard
2. Click on your backend service
3. Go to **Environment** tab
4. Add the following:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `10000` | `10000` |
| `MONGO_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/slotswapper` |
| `JWT_SECRET` | 64-character random string | Generate with command above |

---

## 🔄 **Complete Connection Flow**

### **Local Development:**
```
Frontend (http://localhost:3000)
    ↓
  .env: REACT_APP_API_URL=http://localhost:4000/api
    ↓
Backend (http://localhost:4000)
    ↓
  .env: MONGO_URI=mongodb://localhost:27017/slotswapper
    ↓
MongoDB (localhost:27017)
```

### **Production Deployment:**
```
Frontend (Vercel: https://your-app.vercel.app)
    ↓
  Vercel Env Var: REACT_APP_API_URL=https://your-backend.onrender.com/api
    ↓
Backend (Render: https://your-backend.onrender.com)
    ↓
  Render Env Var: MONGO_URI=mongodb+srv://...mongodb.net/slotswapper
    ↓
MongoDB Atlas (Cloud)
```

---

## ✅ **Verification Steps**

### **1. Check Local Frontend Connection:**

**Start backend:**
```powershell
cd backend
npm run dev
# Should see: Server running on port 4000
```

**Start frontend (in new terminal):**
```powershell
cd frontend
npm start
# Should see: Compiled successfully!
```

**Test:**
- Open http://localhost:3000
- Try to sign up/login
- Check browser console (F12) for API calls

### **2. Check Production Frontend Connection:**

After deploying to Vercel:

**Test:**
- Open your Vercel URL (e.g., https://slot-swapper-frontend.vercel.app)
- Open browser console (F12)
- Check Network tab for API calls
- Should see requests to your backend URL

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Failed to fetch" or CORS errors**

**Cause**: Backend not running or wrong URL

**Solution:**
```bash
# Check backend is running:
curl http://localhost:4000/api/health
# Should return: {"status":"healthy", ...}

# Check frontend .env has correct URL:
cat frontend/.env
# Should show: REACT_APP_API_URL=http://localhost:4000/api
```

### **Issue 2: Environment variable not working in production**

**Cause**: Vercel doesn't recognize the new variable

**Solution:**
1. Add variable in Vercel Dashboard
2. Click **Redeploy** (important!)
3. Or push a new commit to trigger rebuild

### **Issue 3: Backend returns 404 for all API calls**

**Cause**: Missing `/api` in URL

**Solution:**
```bash
# WRONG:
REACT_APP_API_URL=http://localhost:4000

# CORRECT:
REACT_APP_API_URL=http://localhost:4000/api
```

---

## 📝 **Quick Reference**

### **Frontend Environment Variable:**
- **Name**: `REACT_APP_API_URL`
- **Local**: `http://localhost:4000/api`
- **Production**: `https://your-backend-name.onrender.com/api`
- **Where to set**: 
  - Local: `frontend/.env`
  - Production: Vercel Dashboard → Settings → Environment Variables

### **Backend Environment Variables:**
- **Names**: `NODE_ENV`, `PORT`, `MONGO_URI`, `JWT_SECRET`
- **Where to set**:
  - Local: `backend/.env`
  - Production: Render Dashboard → Environment tab

---

## 🎯 **Next Steps**

1. ✅ **Local**: Your `.env` file is already configured correctly
2. 🚀 **Deploy Backend**: Deploy to Render first to get the backend URL
3. 🌐 **Update Frontend**: Add backend URL to Vercel environment variables
4. ✅ **Test**: Verify the connection works end-to-end

**Need help?** Check the deployment guides:
- [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md) - Frontend deployment
- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - Complete deployment guide
