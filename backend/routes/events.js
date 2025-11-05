const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Event = require('../models/Event');
const { requireAuth } = require('../middleware/authMiddleware');

// Create event
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { title, startTime, endTime } = req.body;
  if (!title || !startTime || !endTime) {
    res.status(400);
    throw new Error('Missing fields');
  }
  const ev = await Event.create({ title, startTime, endTime, owner: req.user._id });
  res.status(201).json(ev);
}));

// Get my events
router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(events);
}));

// Update event
router.put('/:id', requireAuth, asyncHandler(async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) { res.status(404); throw new Error('Event not found'); }
  if (!ev.owner.equals(req.user._id)) { res.status(403); throw new Error('Forbidden'); }
  const { title, startTime, endTime, status } = req.body;
  if (title) ev.title = title;
  if (startTime) ev.startTime = startTime;
  if (endTime) ev.endTime = endTime;
  if (status) {
    // Only allow valid transitions in a simple way
    if (['BUSY','SWAPPABLE','SWAP_PENDING'].includes(status)) ev.status = status;
  }
  await ev.save();
  res.json(ev);
}));

// Delete event
router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) { res.status(404); throw new Error('Event not found'); }
  if (!ev.owner.equals(req.user._id)) { res.status(403); throw new Error('Forbidden'); }
  await ev.deleteOne();
  res.json({ message: 'Deleted' });
}));

// Marketplace: swappable events from other users
router.get('/swappable', requireAuth, asyncHandler(async (req, res) => {
  const events = await Event.find({ owner: { $ne: req.user._id }, status: 'SWAPPABLE' }).populate('owner', 'name email');
  res.json(events);
}));

module.exports = router;
