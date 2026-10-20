const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route  POST /api/auth/register
// @desc   Register a new user
// @access Public
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const user = await User.create({ name, phone, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  POST /api/auth/login
// @desc   Login with phone and password
// @access Public
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Please enter phone and password' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  PUT /api/auth/change-password
// @desc   Change password by name (finds user by name and updates password)
// @access Public (name-based lookup) — protect if you want auth required
router.put('/change-password', async (req, res) => {
  try {
    const { name, newPassword } = req.body;

    if (!name || !newPassword) {
      return res.status(400).json({ message: 'Name and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (!user) {
      return res.status(404).json({ message: 'User not found with that name' });
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res.json({ message: `Password updated successfully for ${user.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
