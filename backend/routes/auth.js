const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token (fallback secret for dev to prevent crashes)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password' 
      });
    }

    if (password.length < 6) {
      console.log('Validation failed - password too short');
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log('Checking if user already exists...');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.log('Creating new user...');
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role && ['student','instructor','admin'].includes(role) ? role : 'student'
    });

    console.log('Saving user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    // Duplicate email
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    // Mongoose validation error
    if (error && error.name === 'ValidationError') {
      const firstErr = Object.values(error.errors || {})[0];
      const msg = firstErr?.message || 'Validation failed';
      return res.status(400).json({ message: msg });
    }
    console.error('Error details:', error.message);
    return res.status(500).json({ 
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        enrolledCourses: req.user.enrolledCourses,
        profile: req.user.profile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      college,
      course,
      year,
      address,
      bio,
      profilePicture,
      dateOfBirth,
      rollNumber,
      department
    } = req.body;
    
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (name) user.name = name;

    // Initialize profile if it doesn't exist
    if (!user.profile) user.profile = {};
    
    // Update profile fields
    if (phone !== undefined) user.profile.phone = phone;
    if (college !== undefined) user.profile.college = college;
    if (course !== undefined) user.profile.course = course;
    if (year !== undefined) user.profile.year = year;
    if (address !== undefined) user.profile.address = address;
    if (bio !== undefined) user.profile.bio = bio;
    if (profilePicture !== undefined) user.profile.profilePicture = profilePicture;
    if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth;
    if (rollNumber !== undefined) user.profile.rollNumber = rollNumber;
    if (department !== undefined) user.profile.department = department;
    
    await user.save();
    
    // Return the updated user data
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/google
// @desc    Sign in/up with Google credential
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing' });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name || 'Google User',
        email,
        googleId,
        provider: 'google',
        profile: { profilePicture: picture }
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.provider = 'google';
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({
      message: 'Google sign-in successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
});


module.exports = router;
