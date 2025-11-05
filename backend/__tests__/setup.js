const mongoose = require('mongoose');

// Setup test database connection
beforeAll(async () => {
  // Use a test MongoDB URI or mock
  const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/slotswapper-test';
  
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    // If MongoDB isn't available, we'll skip database tests
    console.log('MongoDB not available for testing. Tests will be mocked.');
  }
});

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
});

// Increase timeout for database operations
jest.setTimeout(30000);