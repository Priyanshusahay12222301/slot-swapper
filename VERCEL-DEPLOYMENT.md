# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### **Step 1: Deploy Frontend**

1. **Go to [vercel.com](https://vercel.com) and sign in with GitHub**

2. **Click "New Project"**

3. **Import your GitHub repository:**
   - Repository: `Priyanshusahay12222301/slot-swapper`
   - Framework: `Create React App`
   - Root Directory: `frontend`

4. **Configure Build Settings:**
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   Development Command: npm start
   ```

5. **Environment Variables** (Add in Vercel Dashboard):
   ```
   REACT_APP_API_URL = http://localhost:4000/api
   ```
   *(You'll update this to your live backend URL later)*

6. **Click "Deploy"**

### **Step 2: Update Environment Variables (After Backend is Deployed)**

1. **Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

2. **Update `REACT_APP_API_URL` to your live backend:**
   ```
   REACT_APP_API_URL = https://your-backend-name.onrender.com/api
   ```

3. **Redeploy** (Vercel will auto-redeploy when you push to GitHub)

### **Step 3: Custom Domain (Optional)**

1. **Go to Settings → Domains**
2. **Add your custom domain**
3. **Follow DNS setup instructions**

## 🔧 Troubleshooting

### **Common Issues:**

**1. Build Errors:**
```bash
# Check your package.json has correct scripts
"scripts": {
  "build": "react-scripts build"
}
```

**2. Environment Variables Not Working:**
- Make sure variables start with `REACT_APP_`
- Redeploy after adding env vars
- Check browser console for API calls

**3. Routing Issues (404 on refresh):**
- The `vercel.json` file handles this with SPA routing
- Ensure all routes redirect to `/index.html`

**4. API Connection Failed:**
- Check `REACT_APP_API_URL` is correct
- Ensure backend has CORS configured
- Verify backend is deployed and accessible

### **Verify Deployment:**

1. **Frontend URL**: `https://your-project-name.vercel.app`
2. **Check Health**: Open browser console and verify API calls
3. **Test Features**: Sign up, login, create events, browse marketplace

## ⚡ Auto-Deploy Setup

**Vercel automatically redeploys when you push to GitHub main branch!**

1. **Make changes to your code**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. **Vercel automatically builds and deploys** ✨

## 📊 Production URLs

- **Frontend**: https://slot-swapper-frontend.vercel.app
- **Backend**: https://your-backend.onrender.com *(Update when backend is deployed)*

---

**Next**: Deploy your backend to Render following [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)