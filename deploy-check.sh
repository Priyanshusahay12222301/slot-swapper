#!/bin/bash

# Deployment Readiness Checker for Slot Swapper
echo "🚀 Checking Deployment Readiness for Slot Swapper..."
echo "=================================================="

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 exists"
    else
        echo "❌ $1 missing"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1 directory exists"
    else
        echo "❌ $1 directory missing"
        return 1
    fi
}

echo ""
echo "📁 Checking Project Structure..."
check_dir "backend"
check_dir "frontend"
check_file "backend/package.json"
check_file "frontend/package.json"
check_file "backend/app.js"

echo ""
echo "🔧 Checking Configuration Files..."
check_file "backend/.env.production"
check_file "frontend/.env.production"
check_file "backend/render.yaml"
check_file "frontend/vercel.json"
check_file "DEPLOYMENT-GUIDE.md"

echo ""
echo "📦 Checking Dependencies..."
cd backend
if npm list --depth=0 > /dev/null 2>&1; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing - run 'npm install' in backend/"
fi

cd ../frontend
if npm list --depth=0 > /dev/null 2>&1; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies missing - run 'npm install' in frontend/"
fi

cd ..

echo ""
echo "🔍 Checking Environment Files..."
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env exists (for local development)"
else
    echo "⚠️ Backend .env missing - create from .env.example for local dev"
fi

echo ""
echo "=================================================="
echo "📋 Next Steps for Deployment:"
echo ""
echo "1. 🍃 Setup MongoDB Atlas:"
echo "   - Create account at https://www.mongodb.com/atlas"
echo "   - Create cluster and get connection string"
echo ""
echo "2. 🖥 Deploy Backend to Render:"
echo "   - Create account at https://render.com"
echo "   - Connect GitHub repository"
echo "   - Add environment variables from backend/.env.production"
echo ""
echo "3. 🎨 Deploy Frontend to Vercel:"
echo "   - Create account at https://vercel.com"
echo "   - Connect GitHub repository"
echo "   - Add REACT_APP_API_URL environment variable"
echo ""
echo "4. 📖 Follow the complete guide in DEPLOYMENT-GUIDE.md"
echo ""
echo "🎉 Your Slot Swapper is ready for deployment!"