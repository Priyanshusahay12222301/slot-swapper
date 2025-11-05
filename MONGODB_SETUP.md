# MongoDB Setup Guide

## Option 1: Use MongoDB Atlas (Cloud - Easiest)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get the connection string
6. Update `backend/.env` with your connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
   ```

## Option 2: Use Local MongoDB

### Windows:
1. Download MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
4. Use this in `backend/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/slotswapper
   ```

### macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Option 3: Use Docker (if you have Docker installed)

```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

## Temporary Demo Database

For quick testing, I've provided a demo MongoDB Atlas connection in the `.env` file. This is shared and temporary - replace with your own for production use.