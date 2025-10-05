const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import User model
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create instructor user
const createInstructor = async () => {
  try {
    await connectDB();

    // Check if instructor already exists
    const existingInstructor = await User.findOne({ email: 'instructor@example.com' });
    if (existingInstructor) {
      console.log('Instructor user already exists');
      console.log('Email: instructor@example.com');
      console.log('Password: instructor123');
      process.exit(0);
    }

    // Create new instructor user
    const instructorData = {
      name: 'John Instructor',
      email: 'instructor@example.com',
      password: 'instructor123',
      role: 'instructor',
      profile: {
        bio: 'Experienced instructor with 10+ years in education',
        phone: '+1-555-0123',
        address: 'Education Department, University Campus'
      }
    };

    const instructor = new User(instructorData);
    await instructor.save();

    console.log('✅ Instructor user created successfully!');
    console.log('📧 Email: instructor@example.com');
    console.log('🔑 Password: instructor123');
    console.log('👤 Role: instructor');
    console.log('');
    console.log('You can now:');
    console.log('1. Go to /instructor-login');
    console.log('2. Login with the above credentials');
    console.log('3. Access the instructor dashboard to view student details');

    process.exit(0);
  } catch (error) {
    console.error('Error creating instructor:', error);
    process.exit(1);
  }
};

// Run the script
createInstructor();
