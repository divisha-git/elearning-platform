const jwt = require('jsonwebtoken');
const User = require('../models/User');

const instructorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Use same fallback secret as token generation
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check if user is instructor or admin
    if (user.role !== 'instructor' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Instructor privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = instructorAuth;
