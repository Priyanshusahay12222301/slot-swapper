const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth');
const eventRoutes = require('../routes/events');
const Event = require('../models/Event');

// Setup test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);

describe('Event Routes', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Create and authenticate a test user
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

  describe('POST /api/events', () => {
    it('should create a new event successfully', async () => {
      const eventData = {
        title: 'Team Meeting',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString()    // Tomorrow + 1hr
      };

      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(201);

      expect(res.body).toMatchObject({
        title: eventData.title,
        status: 'BUSY',
        owner: userId
      });
      expect(new Date(res.body.startTime)).toEqual(new Date(eventData.startTime));
    });

    it('should not create event without authentication', async () => {
      const eventData = {
        title: 'Team Meeting',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      };

      await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(401);
    });

    it('should not create event with invalid time range', async () => {
      const eventData = {
        title: 'Team Meeting',
        startTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Later time
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()    // Earlier time
      };

      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(400);

      expect(res.body.message).toContain('End time must be after start time');
    });

    it('should not create event in the past', async () => {
      const eventData = {
        title: 'Past Event',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()    // Yesterday + 1hr
      };

      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(400);

      expect(res.body.message).toContain('Start time must be in the future');
    });
  });

  describe('GET /api/events', () => {
    beforeEach(async () => {
      // Create some test events
      const events = [
        {
          title: 'Meeting 1',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
          owner: userId,
          status: 'BUSY'
        },
        {
          title: 'Meeting 2',
          startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 49 * 60 * 60 * 1000),
          owner: userId,
          status: 'SWAPPABLE'
        }
      ];
      
      await Event.insertMany(events);
    });

    it('should get user events', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('title', 'Meeting 1');
      expect(res.body[1]).toHaveProperty('title', 'Meeting 2');
    });

    it('should not get events without authentication', async () => {
      await request(app)
        .get('/api/events')
        .expect(401);
    });
  });

  describe('GET /api/events/swappable', () => {
    beforeEach(async () => {
      // Create another user
      const userData2 = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };
      
      const signupRes2 = await request(app)
        .post('/api/signup')
        .send(userData2);
      
      const user2Id = signupRes2.body.user._id;

      // Create events from different users
      const events = [
        {
          title: 'My Event (BUSY)',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
          owner: userId,
          status: 'BUSY'
        },
        {
          title: 'My Event (SWAPPABLE)',
          startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 49 * 60 * 60 * 1000),
          owner: userId,
          status: 'SWAPPABLE'
        },
        {
          title: 'Other User Event (SWAPPABLE)',
          startTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 73 * 60 * 60 * 1000),
          owner: user2Id,
          status: 'SWAPPABLE'
        }
      ];
      
      await Event.insertMany(events);
    });

    it('should get only swappable events from other users', async () => {
      const res = await request(app)
        .get('/api/events/swappable')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('title', 'Other User Event (SWAPPABLE)');
      expect(res.body[0]).toHaveProperty('status', 'SWAPPABLE');
      expect(res.body[0].owner).not.toEqual(userId);
    });
  });

  describe('PUT /api/events/:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = new Event({
        title: 'Original Meeting',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
        owner: userId,
        status: 'BUSY'
      });
      const savedEvent = await event.save();
      eventId = savedEvent._id;
    });

    it('should update event status successfully', async () => {
      const updateData = { status: 'SWAPPABLE' };

      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body).toHaveProperty('status', 'SWAPPABLE');
    });

    it('should not update event of another user', async () => {
      // Create another user
      const userData2 = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };
      
      const signupRes2 = await request(app)
        .post('/api/signup')
        .send(userData2);
      
      const authToken2 = signupRes2.body.token;

      const updateData = { status: 'SWAPPABLE' };

      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send(updateData)
        .expect(404);

      expect(res.body.message).toContain('Event not found');
    });
  });

  describe('DELETE /api/events/:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = new Event({
        title: 'Event to Delete',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
        owner: userId,
        status: 'BUSY'
      });
      const savedEvent = await event.save();
      eventId = savedEvent._id;
    });

    it('should delete event successfully', async () => {
      await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify event is deleted
      const deletedEvent = await Event.findById(eventId);
      expect(deletedEvent).toBeNull();
    });

    it('should not delete event of another user', async () => {
      // Create another user
      const userData2 = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };
      
      const signupRes2 = await request(app)
        .post('/api/signup')
        .send(userData2);
      
      const authToken2 = signupRes2.body.token;

      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(404);

      expect(res.body.message).toContain('Event not found');

      // Verify event still exists
      const event = await Event.findById(eventId);
      expect(event).not.toBeNull();
    });
  });
});