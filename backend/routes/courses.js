const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const videosFile = path.join(__dirname, '..', 'storage', 'course-videos.json');

async function readVideos() {
  try {
    const data = await fs.readFile(videosFile, 'utf8');
    return JSON.parse(data || '{}');
  } catch (e) {
    return {};
  }
}

// GET /api/courses/:courseId/videos - public endpoint to list course videos
router.get('/:courseId/videos', async (req, res) => {
  try {
    const all = await readVideos();
    const list = all[req.params.courseId] || [];
    res.json({ videos: list });
  } catch (error) {
    console.error('Public list course videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
