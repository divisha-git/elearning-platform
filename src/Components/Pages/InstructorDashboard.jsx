import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function InstructorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Restrict to Overview only (remove tabs)
  const [activeTab] = useState('overview');
  // Manage Videos state
  const [mvCourseId, setMvCourseId] = useState('react');
  const [mvVideos, setMvVideos] = useState([]);
  const [mvLoading, setMvLoading] = useState(false);
  const [mvError, setMvError] = useState('');
  const [mvEditingId, setMvEditingId] = useState('');
  const [mvEdit, setMvEdit] = useState({ title: '', desc: '', link: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, rRes, dRes] = await Promise.all([
          axios.get('/api/instructor/students'),
          axios.get('/api/instructor/scores'),
          axios.get('/api/instructor/dashboard')
        ]);
        setStudents(sRes.data.students || []);
        setResults(rRes.data.results || []);
        setDashboardStats(dRes.data || {});
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load instructor data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Payment notifications disabled

  // Manage Videos helpers
  const loadCourseVideos = async (courseId) => {
    if (!courseId) return;
    setMvLoading(true);
    setMvError('');
    try {
      const res = await axios.get(`/api/instructor/courses/${courseId}/videos`);
      setMvVideos(res.data.videos || []);
    } catch (e) {
      setMvError(e.response?.data?.message || 'Failed to load videos');
    } finally {
      setMvLoading(false);
    }
  };

  const addCourseVideo = async (e) => {
    e.preventDefault();
    if (!mvCourseId) {
      setMvError('Please enter a course ID');
      return;
    }
    if (!mvNew.title || !mvNew.link) {
      setMvError('Title and Video Link are required');
      return;
    }
    setMvLoading(true);
    setMvError('');
    try {
      await axios.post(`/api/instructor/courses/${mvCourseId}/videos`, mvNew);
      setMvNew({ title: '', desc: '', link: '' });
      await loadCourseVideos(mvCourseId);
    } catch (e) {
      setMvError(e.response?.data?.message || 'Failed to add video');
    } finally {
      setMvLoading(false);
    }
  };

  const deleteCourseVideo = async (videoId) => {
    if (!mvCourseId || !videoId) return;
    setMvLoading(true);
    setMvError('');
    try {
      await axios.delete(`/api/instructor/courses/${mvCourseId}/videos/${videoId}`);
      await loadCourseVideos(mvCourseId);
    } catch (e) {
      setMvError(e.response?.data?.message || 'Failed to delete video');
    } finally {
      setMvLoading(false);
    }
  };

  // Edit support
  const startEditVideo = (v) => {
    setMvEditingId(v.id);
    setMvEdit({ title: v.title || '', desc: v.desc || '', link: v.link || '' });
  };

  const cancelEditVideo = () => {
    setMvEditingId('');
    setMvEdit({ title: '', desc: '', link: '' });
  };

  const saveEditVideo = async () => {
    if (!mvEditingId || !mvCourseId) return;
    setMvLoading(true);
    setMvError('');
    try {
      await axios.put(`/api/instructor/courses/${mvCourseId}/videos/${mvEditingId}`, mvEdit);
      await loadCourseVideos(mvCourseId);
      cancelEditVideo();
    } catch (e) {
      setMvError(e.response?.data?.message || 'Failed to update video');
    } finally {
      setMvLoading(false);
    }
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setActiveTab('student-details');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || (user?.role !== 'instructor' && user?.role !== 'admin')) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="alert alert-warning">
            <h4>Access Denied</h4>
            <p>You need instructor privileges to access this page.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Instructor Dashboard</h2>
        </div>
        {/* Payment notifications removed */}
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Students Personal Information */}
            <div className="row">
              <div className="col-12 mt-2">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Students Personal Information</h5>
                    <span className="badge bg-secondary">{students.length} total</span>
                  </div>
                  <div className="card-body">
                    {students.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>College</th>
                              <th>Course</th>
                              <th>Year</th>
                              <th>Roll No.</th>
                              <th>Department</th>
                              <th>Address</th>
                              <th>Joined</th>
                              <th>Enrolled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map(s => (
                              <tr key={s._id}>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>{s.phone}</td>
                                <td>{s.college}</td>
                                <td>{s.course}</td>
                                <td>{s.year}</td>
                                <td>{s.rollNumber}</td>
                                <td>{s.department}</td>
                                <td style={{maxWidth: 220}}><span className="text-truncate d-inline-block" style={{maxWidth: 220}} title={s.address}>{s.address}</span></td>
                                <td>{formatDate(s.joinedAt)}</td>
                                <td>{s.enrolledCoursesCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No students found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}


