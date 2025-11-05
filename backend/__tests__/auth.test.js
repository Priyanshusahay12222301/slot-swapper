const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

// Setup test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

describe('Authentication Routes', () => {
  
  describe('POST /api/signup', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        name: userData.name,
        email: userData.email
      });
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should not register user with short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      const res = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should not register user with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/signup')
        .send(userData);

      // Try to register with same email
      const res = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(400);

      expect(res.body.message).toContain('email already exists');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      await request(app)
        .post('/api/signup')
        .send(userData);
    });

    it('should login user with correct credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    it('should not login user with incorrect email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should not login user with incorrect password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(res.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/me', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Register and login to get token
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      const signupRes = await request(app)
        .post('/api/signup')
        .send(userData);
      
      authToken = signupRes.body.token;
      userId = signupRes.body.user._id;
    });

    it('should get current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toMatchObject({
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/me')
        .expect(401);

      expect(res.body.message).toContain('Access denied');
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.message).toContain('Invalid token');
    });
  });
});