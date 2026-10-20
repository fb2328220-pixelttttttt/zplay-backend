const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route  GET /api/users
// @desc   Get all users (name + phone) — admin only
// @access Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('name phone createdAt role').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/users/all
// @desc   Get all users — accessible to any logged-in user (for demo dashboard)
// @access Private
router.get('/all', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('name phone createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
