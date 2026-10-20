const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route  GET /api/users
// @desc   Get all users (name + phone)
// @access Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('name phone createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
