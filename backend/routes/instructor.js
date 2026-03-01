const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const AssessmentResult = require('../models/AssessmentResult');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Ensure only instructors can access
const requireInstructor = (req, res, next) => {
  if (req.user?.role !== 'instructor' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Instructor access required' });
  }
  next();
};

// GET /api/instructor/students - list all registered students with complete details
router.get('/students', auth, requireInstructor, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email profile createdAt enrolledCourses')
      .sort({ createdAt: -1 });
    
    // Get enrollment details for each student
    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const enrollmentCount = student.enrolledCourses ? student.enrolledCourses.length : 0;
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          phone: student.profile?.phone || 'Not provided',
          college: student.profile?.college || 'Not provided',
          course: student.profile?.course || 'Not provided',
          year: student.profile?.year || 'Not provided',
          rollNumber: student.profile?.rollNumber || 'Not provided',
          department: student.profile?.department || 'Not provided',
          address: student.profile?.address || 'Not provided',
          bio: student.profile?.bio || 'Not provided',
          profilePicture: student.profile?.profilePicture || '',
          dateOfBirth: student.profile?.dateOfBirth || 'Not provided',
          joinedAt: student.createdAt,
          enrolledCoursesCount: enrollmentCount,
          enrolledCourses: student.enrolledCourses || []
        };
      })
    );
    
    res.json({ 
      students: studentsWithDetails,
      totalStudents: studentsWithDetails.length 
    });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/instructor/student/:id - get detailed info for a specific student
router.get('/student/:id', auth, requireInstructor, async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' })
      .select('-password')
      .populate('enrolledCourses.courseId');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ student });
  } catch (error) {
    console.error('Fetch student details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/instructor/dashboard - instructor dashboard stats
router.get('/dashboard', auth, requireInstructor, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const recentStudents = await User.find({ role: 'student' })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const stats = {
      totalStudents,
      recentStudents,
      lastUpdated: new Date()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/instructor/scores - list assessment scores (optionally by course/assessment)
router.get('/scores', auth, requireInstructor, async (req, res) => {
  try {
    const { assessmentId, courseId } = req.query;
    const filter = {};
    if (assessmentId) filter.assessmentId = assessmentId;
    if (courseId) filter.courseId = courseId;

    const results = await AssessmentResult.find(filter)
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json({ results });
  } catch (error) {
    console.error('Fetch scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- Course Videos (JSON storage) ----------
const videosFile = path.join(__dirname, '..', 'storage', 'course-videos.json');

async function readVideos() {
  try {
    const data = await fs.readFile(videosFile, 'utf8');
    return JSON.parse(data || '{}');
  } catch (e) {
    return {};
  }
}

async function writeVideos(obj) {
  await fs.writeFile(videosFile, JSON.stringify(obj, null, 2));
}

// GET /api/instructor/courses/:courseId/videos - list videos for a course
router.get('/courses/:courseId/videos', auth, requireInstructor, async (req, res) => {
  try {
    const all = await readVideos();
    const list = all[req.params.courseId] || [];
    res.json({ videos: list });
  } catch (error) {
    console.error('List course videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/instructor/courses/:courseId/videos - add a video (YouTube or mp4 URL)
// body: { title, desc, link }
router.post('/courses/:courseId/videos', auth, requireInstructor, async (req, res) => {
  try {
    const { title, desc, link } = req.body || {};
    if (!title || !link) {
      return res.status(400).json({ message: 'Title and link are required' });
    }
    const courseId = req.params.courseId;
    const all = await readVideos();
    const id = `${Date.now()}`;
    const entry = { id, title, desc: desc || '', link, createdAt: new Date().toISOString(), createdBy: req.user?._id };
    all[courseId] = all[courseId] || [];
    all[courseId].push(entry);
    await writeVideos(all);
    res.status(201).json({ message: 'Video added', video: entry });
  } catch (error) {
    console.error('Add course video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/instructor/courses/:courseId/videos/:videoId - remove a video
router.delete('/courses/:courseId/videos/:videoId', auth, requireInstructor, async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const all = await readVideos();
    const list = all[courseId] || [];
    const nextList = list.filter(v => v.id !== videoId);
    all[courseId] = nextList;
    await writeVideos(all);
    res.json({ message: 'Video removed', removed: list.length - nextList.length });
  } catch (error) {
    console.error('Delete course video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/instructor/courses/:courseId/videos/:videoId - update a video's fields
// body: { title?, desc?, link? }
router.put('/courses/:courseId/videos/:videoId', auth, requireInstructor, async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const { title, desc, link } = req.body || {};
    const all = await readVideos();
    const list = all[courseId] || [];
    const idx = list.findIndex(v => v.id === videoId);
    if (idx === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const current = list[idx];
    const updated = {
      ...current,
      title: title !== undefined ? title : current.title,
      desc: desc !== undefined ? desc : current.desc,
      link: link !== undefined ? link : current.link,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?._id,
    };
    list[idx] = updated;
    all[courseId] = list;
    await writeVideos(all);
    res.json({ message: 'Video updated', video: updated });
  } catch (error) {
    console.error('Update course video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
