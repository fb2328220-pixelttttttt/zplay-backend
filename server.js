const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ZPlay API is running' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USERNAME')) {
  console.error('❌  ERROR: MONGODB_URI is not set in your .env file.');
  console.error('👉  Open backend/.env and replace YOUR_USERNAME and YOUR_PASSWORD with your MongoDB Atlas credentials.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    console.error('👉  Check your MONGODB_URI in backend/.env — make sure the username, password and cluster URL are correct.');
    process.exit(1);
  });
