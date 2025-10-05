import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Profile() {
  const { user, isAuthenticated, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // Payment UI removed as requested
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    year: '',
    address: '',
    bio: '',
    profilePicture: '',
    dateOfBirth: '',
    rollNumber: '',
    department: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        college: user.profile?.college || '',
        course: user.profile?.course || '',
        year: user.profile?.year || '',
        address: user.profile?.address || '',
        bio: user.profile?.bio || '',
        profilePicture: user.profile?.profilePicture || '',
        dateOfBirth: user.profile?.dateOfBirth || '',
        rollNumber: user.profile?.rollNumber || '',
        department: user.profile?.department || ''
      }));
      setImagePreview(user.profile?.profilePicture || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Payment submission removed

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('http://localhost:3000/api/auth/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update the user context with the returned data
      if (response.data.user) {
        // The backend returns the updated user data, so we can use it directly
        await fetchUserProfile();
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h3>Please log in to view your profile</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row">
            {/* Profile Picture and Basic Info */}
            <div className="col-lg-4">
              <div className="card mb-4 shadow">
                <div className="card-body text-center">
                  <div className="mb-3">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="rounded-circle border"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle border d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "150px", height: "150px", backgroundColor: "#e9ecef" }}
                      >
                        <i className="fas fa-user fa-4x text-muted"></i>
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                  
                  <h4 className="mb-1">{profileData.name || 'Student Name'}</h4>
                  <p className="text-muted mb-1">{profileData.course || 'Course not specified'}</p>
                  <p className="text-muted mb-4">{profileData.college || 'College not specified'}</p>
                  
                  <div className="d-flex justify-content-center">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">Academic Info</h5>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span><i className="fas fa-graduation-cap text-primary me-2"></i>Year</span>
                    <span className="text-muted">{profileData.year || 'Not specified'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span><i className="fas fa-id-card text-primary me-2"></i>Roll No</span>
                    <span className="text-muted">{profileData.rollNumber || 'Not specified'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span><i className="fas fa-building text-primary me-2"></i>Department</span>
                    <span className="text-muted">{profileData.department || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Payment UI removed */}
            </div>

            {/* Profile Details */}
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Profile Information</h5>
                  {success && (
                    <div className="alert alert-success mb-0 py-1 px-2" role="alert">
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger mb-0 py-1 px-2" role="alert">
                      {error}
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Full Name</strong></label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.name || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Email</strong></label>
                        <p className="form-control-plaintext">{profileData.email}</p>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Phone Number</strong></label>
                        {isEditing ? (
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.phone || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Date of Birth</strong></label>
                        {isEditing ? (
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.dateOfBirth || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>College Name</strong></label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="college"
                            value={profileData.college}
                            onChange={handleInputChange}
                            placeholder="Enter your college name"
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.college || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Course</strong></label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="course"
                            value={profileData.course}
                            onChange={handleInputChange}
                            placeholder="e.g., B.Tech Computer Science"
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.course || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Year of Study</strong></label>
                        {isEditing ? (
                          <select
                            className="form-control"
                            name="year"
                            value={profileData.year}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Graduate">Graduate</option>
                          </select>
                        ) : (
                          <p className="form-control-plaintext">{profileData.year || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label"><strong>Roll Number</strong></label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="rollNumber"
                            value={profileData.rollNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your roll number"
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.rollNumber || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-12 mb-3">
                        <label className="form-label"><strong>Department</strong></label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="department"
                            value={profileData.department}
                            onChange={handleInputChange}
                            placeholder="e.g., Computer Science & Engineering"
                          />
                        ) : (
                          <p className="form-control-plaintext">{profileData.department || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-12 mb-3">
                        <label className="form-label"><strong>Address</strong></label>
                        {isEditing ? (
                          <textarea
                            className="form-control"
                            name="address"
                            rows="3"
                            value={profileData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                          ></textarea>
                        ) : (
                          <p className="form-control-plaintext">{profileData.address || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div className="col-md-12 mb-3">
                        <label className="form-label"><strong>Bio</strong></label>
                        {isEditing ? (
                          <textarea
                            className="form-control"
                            name="bio"
                            rows="4"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                          ></textarea>
                        ) : (
                          <p className="form-control-plaintext">{profileData.bio || 'No bio provided'}</p>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="text-end">
                        <button 
                          type="submit" 
                          className="btn btn-success"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Payment Modal removed */}
    </>
  );
}
