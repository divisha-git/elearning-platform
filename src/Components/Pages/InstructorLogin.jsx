import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function InstructorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      // Check if user has instructor role
      if (result.user.role !== 'instructor' && result.user.role !== 'admin') {
        setError('Access denied. This login is for instructors only.');
        setLoading(false);
        return;
      }

      // Redirect to instructor dashboard
      navigate('/instructor-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-chalkboard-teacher fa-3x text-primary mb-3"></i>
                  <h2 className="card-title">Instructor Login</h2>
                  <p className="text-muted">Access your instructor dashboard</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In as Instructor
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <div className="border-top pt-3">
                    <p className="text-muted mb-2">Not an instructor?</p>
                    <Link to="/auth" className="btn btn-outline-secondary">
                      <i className="fas fa-user me-2"></i>
                      Student Login
                    </Link>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="text-primary mb-2">
                    <i className="fas fa-info-circle me-2"></i>
                    Instructor Access
                  </h6>
                  <small className="text-muted">
                    This login is exclusively for instructors and administrators. 
                    You can view student details, assessment scores, and manage course content.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
