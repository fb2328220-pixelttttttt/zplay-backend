const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route  POST /api/auth/submit
// @desc   Save name and phone to MongoDB
// @access Public
router.post('/submit', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // Save to MongoDB
    const user = await User.create({ name, phone });

    res.status(201).json({
      success: true,
      message: 'Information saved successfully',
      data: {
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
