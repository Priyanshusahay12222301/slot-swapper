const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    const uri = mongoUri || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not provided');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please ensure MongoDB is running or update MONGO_URI in .env file');
    console.error('For local MongoDB: brew install mongodb/brew/mongodb-community (Mac) or download from https://www.mongodb.com/try/download/community');
    console.error('For cloud: Use MongoDB Atlas at https://www.mongodb.com/cloud/atlas');
    process.exit(1);
  }
};

module.exports = connectDB;
