const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth');
const eventRoutes = require('../routes/events');
const swapRoutes = require('../routes/swaps');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

// Setup test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

describe('Swap Logic (Complex Transactions)', () => {
  let user1Token, user2Token;
  let user1Id, user2Id;
  let user1Event, user2Event;

  beforeEach(async () => {
    // Create two test users
    const userData1 = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123'
    };
    
    const userData2 = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password123'
    };

    const signupRes1 = await request(app).post('/api/signup').send(userData1);
    const signupRes2 = await request(app).post('/api/signup').send(userData2);

    user1Token = signupRes1.body.token;
    user2Token = signupRes2.body.token;
    user1Id = signupRes1.body.user._id;
    user2Id = signupRes2.body.user._id;

    // Create events for both users
    user1Event = new Event({
      title: 'Alice Meeting',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
      owner: user1Id,
      status: 'SWAPPABLE'
    });

    user2Event = new Event({
      title: 'Bob Meeting', 
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 49 * 60 * 60 * 1000),
      owner: user2Id,
      status: 'SWAPPABLE'
    });

    await user1Event.save();
    await user2Event.save();
  });

  describe('POST /api/swaps/swap-request', () => {
    it('should create a swap request successfully', async () => {
      const swapData = {
        targetEventId: user2Event._id,
        myEventId: user1Event._id
      };

      const res = await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData)
        .expect(201);

      expect(res.body).toMatchObject({
        requester: user1Id,
        owner: user2Id,
        requesterEvent: user1Event._id.toString(),
        ownerEvent: user2Event._id.toString(),
        status: 'PENDING'
      });

      // Check that events are now marked as SWAP_PENDING
      const updatedEvent1 = await Event.findById(user1Event._id);
      const updatedEvent2 = await Event.findById(user2Event._id);
      
      expect(updatedEvent1.status).toBe('SWAP_PENDING');
      expect(updatedEvent2.status).toBe('SWAP_PENDING');
    });

    it('should not create swap request for non-swappable event', async () => {
      // Make user2's event BUSY
      await Event.findByIdAndUpdate(user2Event._id, { status: 'BUSY' });

      const swapData = {
        targetEventId: user2Event._id,
        myEventId: user1Event._id
      };

      const res = await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData)
        .expect(400);

      expect(res.body.message).toContain('not available for swapping');
    });

    it('should not create swap request with own event', async () => {
      const swapData = {
        targetEventId: user1Event._id, // User's own event
        myEventId: user1Event._id
      };

      const res = await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData)
        .expect(400);

      expect(res.body.message).toContain('cannot request swap with your own event');
    });

    it('should not create duplicate swap request', async () => {
      const swapData = {
        targetEventId: user2Event._id,
        myEventId: user1Event._id
      };

      // Create first request
      await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData)
        .expect(201);

      // Try to create duplicate
      const res = await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData)
        .expect(400);

      expect(res.body.message).toContain('Swap request already exists');
    });
  });

  describe('POST /api/swaps/swap-response/:id', () => {
    let swapRequestId;

    beforeEach(async () => {
      // Create a swap request
      const swapData = {
        targetEventId: user2Event._id,
        myEventId: user1Event._id
      };

      const swapRes = await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData);

      swapRequestId = swapRes.body._id;
    });

    it('should accept swap and exchange ownership (TRANSACTION TEST)', async () => {
      const responseData = { response: 'ACCEPTED' };

      const res = await request(app)
        .post(`/api/swaps/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send(responseData)
        .expect(200);

      expect(res.body.message).toContain('Swap completed successfully');

      // Verify the atomic transaction worked correctly
      const updatedEvent1 = await Event.findById(user1Event._id);
      const updatedEvent2 = await Event.findById(user2Event._id);
      const swapRequest = await SwapRequest.findById(swapRequestId);

      // Check ownership has been swapped
      expect(updatedEvent1.owner.toString()).toBe(user2Id);
      expect(updatedEvent2.owner.toString()).toBe(user1Id);

      // Check status is back to SWAPPABLE
      expect(updatedEvent1.status).toBe('SWAPPABLE');
      expect(updatedEvent2.status).toBe('SWAPPABLE');

      // Check swap request is marked as ACCEPTED
      expect(swapRequest.status).toBe('ACCEPTED');
    });

    it('should reject swap and restore original status', async () => {
      const responseData = { response: 'REJECTED' };

      const res = await request(app)
        .post(`/api/swaps/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send(responseData)
        .expect(200);

      expect(res.body.message).toContain('Swap request rejected');

      // Verify ownership remains unchanged
      const updatedEvent1 = await Event.findById(user1Event._id);
      const updatedEvent2 = await Event.findById(user2Event._id);
      const swapRequest = await SwapRequest.findById(swapRequestId);

      // Check ownership is unchanged
      expect(updatedEvent1.owner.toString()).toBe(user1Id);
      expect(updatedEvent2.owner.toString()).toBe(user2Id);

      // Check status is back to SWAPPABLE
      expect(updatedEvent1.status).toBe('SWAPPABLE');
      expect(updatedEvent2.status).toBe('SWAPPABLE');

      // Check swap request is marked as REJECTED
      expect(swapRequest.status).toBe('REJECTED');
    });

    it('should not allow non-owner to respond to swap request', async () => {
      const responseData = { response: 'ACCEPTED' };

      const res = await request(app)
        .post(`/api/swaps/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${user1Token}`) // Wrong user
        .send(responseData)
        .expect(404);

      expect(res.body.message).toContain('Swap request not found');
    });

    it('should not allow responding to already processed request', async () => {
      // Accept the request first
      await request(app)
        .post(`/api/swaps/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ response: 'ACCEPTED' });

      // Try to respond again
      const res = await request(app)
        .post(`/api/swaps/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ response: 'REJECTED' })
        .expect(400);

      expect(res.body.message).toContain('already been processed');
    });
  });

  describe('GET /api/swaps/my-requests', () => {
    beforeEach(async () => {
      // Create multiple swap requests
      const swap1 = new SwapRequest({
        requester: user1Id,
        owner: user2Id,
        requesterEvent: user1Event._id,
        ownerEvent: user2Event._id,
        status: 'PENDING'
      });

      const swap2 = new SwapRequest({
        requester: user2Id,
        owner: user1Id,
        requesterEvent: user2Event._id,
        ownerEvent: user1Event._id,
        status: 'ACCEPTED'
      });

      await swap1.save();
      await swap2.save();
    });

    it('should get user sent requests', async () => {
      const res = await request(app)
        .get('/api/swaps/my-requests?type=sent')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('requester');
      expect(res.body[0].requester._id).toBe(user1Id);
    });

    it('should get user received requests', async () => {
      const res = await request(app)
        .get('/api/swaps/my-requests?type=received')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('owner');
      expect(res.body[0].owner._id).toBe(user1Id);
    });

    it('should get all user requests by default', async () => {
      const res = await request(app)
        .get('/api/swaps/my-requests')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(res.body).toHaveLength(2);
    });
  });

  describe('Transaction Rollback Test', () => {
    it('should rollback transaction if swap fails midway', async () => {
      // This test simulates a scenario where the transaction might fail
      // In a real scenario, you might mock mongoose operations to force failures
      
      const swapData = {
        targetEventId: user2Event._id,
        myEventId: user1Event._id
      };

      // Create swap request
      const swapRes = await request(app)
        .post('/api/swaps/swap-request')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(swapData);

      const swapRequestId = swapRes.body._id;

      // Delete one of the events to simulate data corruption
      await Event.findByIdAndDelete(user1Event._id);

      // Try to accept swap - should fail gracefully
      const res = await request(app)
        .post(`/api/swaps/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ response: 'ACCEPTED' })
        .expect(500);

      // Verify the remaining event's status is restored
      const remainingEvent = await Event.findById(user2Event._id);
      expect(remainingEvent).toBeTruthy();
      
      // The swap should have failed, so status should be restored or handled gracefully
      const swapRequest = await SwapRequest.findById(swapRequestId);
      expect(swapRequest.status).toBe('PENDING'); // Should still be pending since transaction failed
    });
  });
});