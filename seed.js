// Run this once to create an admin user:
// node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // Remove existing admin
  await User.deleteOne({ phone: '251900000000' });

  // Create admin user
  await User.create({
    name: 'Admin',
    phone: '251900000000',
    password: 'admin123',
    role: 'admin',
  });

  console.log('Admin user created:');
  console.log('  Phone:    251900000000');
  console.log('  Password: admin123');
  console.log('  Role:     admin');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
