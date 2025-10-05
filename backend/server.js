const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables (read from project root .env)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB (optional - server will continue without it)
connectDB();

const app = express();

// Middleware
app.use(cors({
  // Allow any local dev origin (5173/5174/5175, etc.) and others
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/contact-file', require('./routes/contact-file'));
app.use('/api/feedback-file', require('./routes/feedback-file'));
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payments', require('./routes/payments'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'eLearning Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      signup: '/api/auth/signup',
      login: '/api/auth/login',
      feedback: '/api/feedback',
      contact: '/api/contact',
      'contact-file': '/api/contact-file (RECOMMENDED - No MongoDB required)',
      'feedback-file': '/api/feedback-file (RECOMMENDED - No MongoDB required)',
      profile: '/api/auth/me',
      'courses (public)': '/api/courses/:courseId/videos'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Error stack:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  res.status(500).json({ 
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => cb(null, true),
    credentials: true
  }
});

// Simple room-based WebRTC signaling (optimized for 1:1 or small groups)
io.on('connection', (socket) => {
  // Join room
  socket.on('webrtc:join', ({ roomId, role }) => {
    socket.join(roomId);
    socket.to(roomId).emit('webrtc:peer-joined', { id: socket.id, role });
  });

  // Relay SDP offer/answer and ICE candidates
  socket.on('webrtc:offer', ({ roomId, to, offer }) => {
    io.to(to).emit('webrtc:offer', { from: socket.id, offer, roomId });
  });
  socket.on('webrtc:answer', ({ roomId, to, answer }) => {
    io.to(to).emit('webrtc:answer', { from: socket.id, answer, roomId });
  });
  socket.on('webrtc:ice', ({ roomId, to, candidate }) => {
    io.to(to).emit('webrtc:ice', { from: socket.id, candidate, roomId });
  });

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms || []);
    rooms.forEach((r) => socket.to(r).emit('webrtc:peer-left', { id: socket.id }));
  });

  // Live class announcements: instructor notifies all clients
  socket.on('live:announce', (payload) => {
    // payload: { roomId, link, title, instructor, ts }
    try {
      io.emit('live:announcement', {
        ...payload,
        ts: payload?.ts || Date.now()
      });
    } catch {}
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
