const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

const STORAGE_DIR = path.join(__dirname, '..', 'storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'payments.json');

// Receiver UPI ID for auto-verification (set UPI_ID in .env; fallback to VITE_UPI_ID or hardcoded default)
const RECEIVER_UPI = (process.env.UPI_ID || process.env.VITE_UPI_ID || 'mdivisha2005@oksbi').trim().toLowerCase();

// --- SSE: simple in-memory subscriber list ---
const sseClients = new Set();

function sseBroadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch {}
  }
}

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
  if (!fs.existsSync(STORAGE_FILE)) fs.writeFileSync(STORAGE_FILE, JSON.stringify({ payments: [] }, null, 2));
}

function readAll() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(raw || '{"payments":[]}');
  } catch (e) {
    return { payments: [] };
  }
}

function writeAll(data) {
  ensureStorage();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
}

// Try to resolve a user by clientToken (could be ObjectId or email)
async function findUserByClientToken(token) {
  if (!token) return null;
  try {
    if (mongoose.Types.ObjectId.isValid(token)) {
      const byId = await User.findById(token);
      if (byId) return byId;
    }
  } catch {}
  try {
    const byEmail = await User.findOne({ email: token.toLowerCase() });
    if (byEmail) return byEmail;
  } catch {}
  return null;
}

async function enrollUserIfNeeded(clientToken, courseId) {
  try {
    const u = await findUserByClientToken(clientToken);
    if (!u) return false;
    const has = (u.enrolledCourses || []).some(ec => ec.courseId === courseId);
    if (!has) {
      u.enrolledCourses = u.enrolledCourses || [];
      u.enrolledCourses.push({ courseId, enrolledAt: new Date() });
      await u.save();
      return true;
    }
  } catch (e) {
    console.error('Enroll error:', e.message);
  }
  return false;
}

// SSE stream for instructor notifications
// GET /api/payments/events
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  // Send a hello event
  res.write(`event: hello\ndata: {"ok":true}\n\n`);
  sseClients.add(res);

  // Heartbeat to keep the connection alive
  const hb = setInterval(() => {
    try { res.write(`event: ping\ndata: {"t":${Date.now()}}\n\n`); } catch {}
  }, 30000);

  req.on('close', () => {
    clearInterval(hb);
    sseClients.delete(res);
    try { res.end(); } catch {}
  });
});

// Submit a manual payment reference for a course
// body: { courseId, upiId, reference, clientToken }
router.post('/submit', (req, res) => {
  const { courseId, upiId, reference, clientToken, name } = req.body || {};
  if (!courseId || !reference || !clientToken) {
    return res.status(400).json({ message: 'courseId, reference and clientToken are required' });
  }
  const db = readAll();
  const id = 'pay_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const now = new Date().toISOString();
  const rec = {
    id,
    courseId,
    upiId: upiId || '',
    reference: String(reference).trim(),
    clientToken,
    name: name || '',
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };
  // Auto-approve if submitted UPI matches the receiver UPI ID
  try {
    const submitted = (upiId || '').trim().toLowerCase();
    if (submitted && RECEIVER_UPI && submitted === RECEIVER_UPI) {
      rec.status = 'approved';
      rec.updatedAt = now;
      // Auto-approve => also enroll the student
      enrollUserIfNeeded(clientToken, courseId).then((ok)=>{
        if (ok) {
          sseBroadcast('payment_approved', { id, courseId, reference: rec.reference, status: rec.status, enrolled: true, name: rec.name || '', clientToken: rec.clientToken });
        }
      });
    }
  } catch {}
  db.payments.push(rec);
  writeAll(db);
  console.log('[PAYMENT SUBMITTED]', rec);
  // Simple notification: write to a log file for admin visibility
  try {
    fs.appendFileSync(path.join(STORAGE_DIR, 'payments-notify.log'), `[${now}] SUBMITTED ${rec.id} ${rec.courseId} ${rec.reference} ${rec.upiId} ${rec.name}\n`);
  } catch {}
  // Broadcast via SSE
  sseBroadcast('payment_submitted', { id, courseId, reference: rec.reference, status: rec.status, name: rec.name, upiId: rec.upiId, clientToken: rec.clientToken });
  return res.json({ id, status: rec.status });
});

// Check status by id
router.get('/status/:id', (req, res) => {
  const { id } = req.params;
  const db = readAll();
  const rec = db.payments.find(p => p.id === id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  return res.json({ id: rec.id, status: rec.status, courseId: rec.courseId, reference: rec.reference });
});

// List pending (admin use)
router.get('/pending', (req, res) => {
  const db = readAll();
  const items = db.payments.filter(p => p.status === 'pending');
  return res.json({ count: items.length, items });
});

// Approve by id (admin use)
router.post('/approve/:id', (req, res) => {
  const { id } = req.params;
  const db = readAll();
  const rec = db.payments.find(p => p.id === id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  rec.status = 'approved';
  rec.updatedAt = new Date().toISOString();
  writeAll(db);
  console.log('[PAYMENT APPROVED]', rec);
  try {
    fs.appendFileSync(path.join(STORAGE_DIR, 'payments-notify.log'), `[${rec.updatedAt}] APPROVED ${rec.id} ${rec.courseId} ${rec.reference}\n`);
  } catch {}
  // Broadcast via SSE
  sseBroadcast('payment_approved', { id: rec.id, courseId: rec.courseId, reference: rec.reference, status: rec.status, name: rec.name || '', clientToken: rec.clientToken });
  // Enroll the student after approval
  enrollUserIfNeeded(rec.clientToken, rec.courseId).then((enrolled) => {
    if (enrolled) {
      sseBroadcast('payment_approved', { id: rec.id, courseId: rec.courseId, reference: rec.reference, status: rec.status, enrolled: true });
    }
  });
  return res.json({ id: rec.id, status: rec.status });
});

// List my submissions by clientToken
router.get('/mine', (req, res) => {
  const clientToken = req.query.clientToken;
  if (!clientToken) return res.status(400).json({ message: 'clientToken required' });
  const db = readAll();
  const items = db.payments.filter(p => p.clientToken === clientToken);
  return res.json({ count: items.length, items });
});

module.exports = router;
