const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User.js').default; // Adjust path if needed

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database.');

    // Check if the admin user already exists
    const existingUser = await User.findOne({ username: 'fonok' });
    if (existingUser) {
      console.log('Admin user "fonok" already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('abc123', 10);

    const adminUser = new User({
      username: 'fonok',
      password: hashedPassword,
      forcePasswordChange: true,
    });

    await adminUser.save();
    console.log('Successfully created admin user "fonok".');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

seedDatabase();
