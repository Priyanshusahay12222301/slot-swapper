const express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');

// Signup
router.post('/signup', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already in use');
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, passwordHash: hash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password required');
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
}));

// Protected route to get current user
router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  res.json({ user: req.user });
}));

module.exports = router;
