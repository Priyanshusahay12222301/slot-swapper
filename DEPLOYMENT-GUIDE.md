# 🌍 Deployment Guide - Host Your Slot Swapper Website

This guide covers deploying your Slot Swapper application to production with multiple hosting options.

## 📋 **Deployment Architecture**

**Recommended Setup:**
- **Frontend**: Vercel (React deployment)
- **Backend**: Render (Node.js API)  
- **Database**: MongoDB Atlas (Cloud database)

## 🗂 **Prerequisites Checklist**

Before deployment, ensure you have:
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] Render account (free tier available)

---

## 🍃 **Step 1: Setup MongoDB Atlas (Database)**

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new project: "SlotSwapper"

### 1.2 Create Database Cluster
```bash
# In MongoDB Atlas Dashboard:
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free tier)
3. Select region closest to you
4. Name cluster: "slotswapper-cluster"
5. Create cluster (takes 1-3 minutes)
```

### 1.3 Configure Database Access
```bash
# Database Access:
1. Go to "Database Access" → "Add New Database User"
2. Username: slotswapper-user
3. Password: Generate secure password (save it!)
4. Database User Privileges: "Read and write to any database"
5. Add User

# Network Access:
1. Go to "Network Access" → "Add IP Address"
2. Choose "Allow Access from Anywhere" (0.0.0.0/0)
3. Confirm
```

### 1.4 Get Connection String
```bash
1. Go to "Clusters" → Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy connection string - looks like:
   mongodb+srv://slotswapper-user:<password>@slotswapper-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

5. Replace <password> with your actual password
6. Add database name: /slotswapper before ?retryWrites
```

**Final connection string example:**
```
mongodb+srv://slotswapper-user:yourpassword@slotswapper-cluster.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
```

---

## 🖥 **Step 2: Deploy Backend to Render**

### 2.1 Prepare Backend for Deployment
First, let's update your backend configuration:

**Create `backend/package.json` scripts (if not already present):**
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

**Update `backend/app.js` port configuration:**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 2.2 Create Render Account & Deploy
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure deployment:

```yaml
# Render Configuration:
Name: slotswapper-backend
Environment: Node
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 2.3 Add Environment Variables in Render
In Render dashboard → Your service → Environment:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://slotswapper-user:yourpassword@slotswapper-cluster.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-key-for-production-change-this
```

**⚠️ Important**: Generate a strong JWT_SECRET:
```bash
# Generate random JWT secret (run in terminal):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Deploy & Test Backend
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://slotswapper-backend.onrender.com`
4. Test: Visit `https://your-backend-url.onrender.com/api/health`

---

## 🎨 **Step 3: Deploy Frontend to Vercel**

### 3.1 Update Frontend Configuration
Update your React app to use the deployed backend:

**Create `frontend/.env.production`:**
```env
REACT_APP_API_URL=https://slotswapper-backend.onrender.com
```

**Update API calls in frontend (if hardcoded):**
```javascript
// In your API files, ensure you're using:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### 3.2 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:

```yaml
# Vercel Configuration:
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 3.3 Add Environment Variables in Vercel
In Vercel dashboard → Your project → Settings → Environment Variables:

```env
REACT_APP_API_URL=https://slotswapper-backend.onrender.com
```

### 3.4 Deploy & Test
1. Click "Deploy"
2. Wait for build (3-5 minutes)
3. Your frontend URL will be: `https://slotswapper-frontend.vercel.app`
4. Test: Visit your Vercel URL and try creating an account

---

## 🔒 **Step 4: Configure CORS for Production**

Update your backend CORS configuration:

**In `backend/app.js`:**
```javascript
const cors = require('cors');

// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://slotswapper-frontend.vercel.app', // Production
    'https://your-custom-domain.com' // If you add custom domain
  ],
  credentials: true
}));
```

Redeploy your backend after this change.

---

## 🎯 **Alternative Hosting Options**

### Option B: Netlify (Frontend) + Railway (Backend)
- **Netlify**: Similar to Vercel, great for React apps
- **Railway**: Similar to Render, good for Node.js apps

### Option C: AWS/Google Cloud (Advanced)
- More complex but highly scalable
- Requires more setup and configuration

### Option D: Heroku (If available in your region)
- Both frontend and backend can be deployed
- Simple deployment with Git

---

## 📊 **Step 5: Custom Domain (Optional)**

### 5.1 For Vercel (Frontend):
1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel → Settings → Domains → Add domain
3. Follow DNS configuration instructions

### 5.2 For Render (Backend):
1. In Render → Settings → Custom Domains
2. Add your API subdomain (e.g., api.yourdomain.com)

---

## 🔍 **Step 6: Testing Your Deployed Application**

### 6.1 Backend Health Check
```bash
# Test backend is working:
curl https://your-backend-url.onrender.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

### 6.2 Complete Application Test
1. **Visit your frontend URL**
2. **Create a new account**
3. **Login with the account**
4. **Create a new event**
5. **Make it swappable**
6. **Test the marketplace**

---

## ⚡ **Performance & Optimization**

### Frontend Optimization:
```bash
# In your frontend, add to package.json:
"scripts": {
  "build": "react-scripts build",
  "analyze": "npm run build && npx serve -s build"
}
```

### Backend Optimization:
- Add compression middleware
- Enable MongoDB indexes
- Add rate limiting

---

## 🚨 **Troubleshooting Common Issues**

### Issue 1: CORS Errors
```javascript
// Fix: Update backend CORS configuration
app.use(cors({
  origin: 'https://your-frontend-domain.vercel.app'
}));
```

### Issue 2: Environment Variables Not Working
- Check variable names match exactly
- Restart deployments after adding variables
- Ensure REACT_APP_ prefix for React variables

### Issue 3: Database Connection Errors
- Verify MongoDB Atlas whitelist includes 0.0.0.0/0
- Check connection string format
- Ensure database user has correct permissions

### Issue 4: Build Failures
```bash
# Common fixes:
- Check Node.js version compatibility
- Clear npm cache: npm cache clean --force
- Delete node_modules and reinstall
```

---

## 📈 **Monitoring & Maintenance**

### Free Monitoring Tools:
- **Render**: Built-in logs and metrics
- **Vercel**: Analytics and performance insights
- **MongoDB Atlas**: Database monitoring
- **UptimeRobot**: Website uptime monitoring

### Regular Maintenance:
- Monitor application logs
- Update dependencies monthly
- Backup database regularly
- Check SSL certificates

---

## ✅ **Deployment Checklist**

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render with environment variables
- [ ] Frontend deployed to Vercel with API URL
- [ ] CORS configured for production URLs
- [ ] Database connection tested
- [ ] Complete user flow tested (signup → login → create event → swap)
- [ ] Error monitoring setup
- [ ] Custom domain configured (optional)

## 🎉 **Success!**

Your Slot Swapper application is now live! Here's what you've accomplished:

✅ **Full-stack MERN application deployed**
✅ **Professional hosting infrastructure** 
✅ **Scalable cloud database**
✅ **Production-ready configuration**

**Share your links:**
- 🌐 **Frontend**: `https://your-app.vercel.app`
- 🔌 **API**: `https://your-backend.onrender.com`

---

## 📞 **Need Help?**

Common support resources:
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

**🚀 Your Slot Swapper is now live and ready for users!**