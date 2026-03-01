const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('../../backend/config/database');

// Load env (use Netlify env in production; .env fallback for local netlify dev)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize DB (non-fatal if not available per connectDB implementation)
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug logging (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes (reuse existing backend routes)
app.use('/api/auth', require('../../backend/routes/auth'));
app.use('/api/feedback', require('../../backend/routes/feedback'));
app.use('/api/contact', require('../../backend/routes/contact'));
app.use('/api/contact-file', require('../../backend/routes/contact-file'));
app.use('/api/feedback-file', require('../../backend/routes/feedback-file'));
app.use('/api/instructor', require('../../backend/routes/instructor'));
app.use('/api/courses', require('../../backend/routes/courses'));
app.use('/api/payments', require('../../backend/routes/payments'));

// Health check under /api for proxied calls
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'netlify-functions', ts: Date.now() });
});

// Health check without /api prefix (direct function URL patterns)
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'netlify-functions', ts: Date.now() });
});

// Base API info at /api (useful if someone visits just /api)
app.get('/api', (req, res) => {
  res.json({
    message: 'API root. Try /api/health or other endpoints.',
    endpoints: ['/api/health', '/api/auth', '/api/contact-file', '/api/feedback-file']
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Netlify Functions API is running' });
});

// Explicit handlers for direct function URL paths
app.get('/.netlify/functions/api', (req, res) => {
  res.json({ message: 'Netlify Functions API is running' });
});
app.get('/.netlify/functions/api/', (req, res) => {
  res.json({ message: 'Netlify Functions API is running' });
});
app.get('/.netlify/functions/api/health', (req, res) => {
  res.json({ ok: true, service: 'netlify-functions', ts: Date.now() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ message: 'Server error occurred' });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports.handler = serverless(app);
