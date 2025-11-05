const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const mongoose = require('mongoose');

const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');
const { requireAuth } = require('../middleware/authMiddleware');

// Create a swap request
router.post('/swap-request', requireAuth, asyncHandler(async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) { res.status(400); throw new Error('Both slot ids required'); }

  // Load slots
  const mySlot = await Event.findById(mySlotId);
  const theirSlot = await Event.findById(theirSlotId);
  if (!mySlot || !theirSlot) { res.status(404); throw new Error('Slot(s) not found'); }

  // Ownership checks
  if (!mySlot.owner.equals(req.user._id)) { res.status(403); throw new Error('You do not own mySlot'); }
  if (theirSlot.owner.equals(req.user._id)) { res.status(400); throw new Error('Cannot swap with your own slot'); }

  // Status checks
  if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
    res.status(400);
    throw new Error('Both slots must be SWAPPABLE to request swap');
  }

  // Create request and mark pending
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const swap = await SwapRequest.create([{ mySlot: mySlot._id, theirSlot: theirSlot._id, fromUser: req.user._id, toUser: theirSlot.owner }], { session });
    // Update slot statuses
    await Event.updateOne({ _id: mySlot._id }, { status: 'SWAP_PENDING' }, { session });
    await Event.updateOne({ _id: theirSlot._id }, { status: 'SWAP_PENDING' }, { session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(swap[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}));

// Respond to a swap request (accept or reject)
router.post('/swap-response/:id', requireAuth, asyncHandler(async (req, res) => {
  const { action } = req.body; // 'accept' or 'reject'
  if (!['accept','reject'].includes(action)) { res.status(400); throw new Error('Invalid action'); }

  const swap = await SwapRequest.findById(req.params.id);
  if (!swap) { res.status(404); throw new Error('Swap request not found'); }
  if (!swap.toUser.equals(req.user._id)) { res.status(403); throw new Error('Not authorized to respond'); }
  if (swap.status !== 'PENDING') { res.status(400); throw new Error('Swap already resolved'); }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const mySlot = await Event.findById(swap.mySlot).session(session);
    const theirSlot = await Event.findById(swap.theirSlot).session(session);
    if (!mySlot || !theirSlot) { res.status(404); throw new Error('Slot not found'); }

    if (action === 'reject') {
      swap.status = 'REJECTED';
      await swap.save({ session });
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: 'Rejected', swap });
    }

    // Accept: swap owners and set BUSY
    const fromUser = swap.fromUser;
    const toUser = swap.toUser;
    // swap owners
    const tmpOwner = mySlot.owner;
    mySlot.owner = theirSlot.owner;
    theirSlot.owner = tmpOwner;
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    swap.status = 'ACCEPTED';
    await mySlot.save({ session });
    await theirSlot.save({ session });
    await swap.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Accepted', swap });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}));

// Get my requests (incoming & outgoing)
router.get('/my-requests', requireAuth, asyncHandler(async (req, res) => {
  const incoming = await SwapRequest.find({ toUser: req.user._id }).populate('mySlot theirSlot fromUser toUser');
  const outgoing = await SwapRequest.find({ fromUser: req.user._id }).populate('mySlot theirSlot fromUser toUser');
  res.json({ incoming, outgoing });
}));

module.exports = router;
