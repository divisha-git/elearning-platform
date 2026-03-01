import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthLanding() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerAsInstructor, setRegisterAsInstructor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const role = registerAsInstructor ? 'instructor' : 'student';
    const result = await register(formData.name, formData.email, formData.password, role);
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        if (registerAsInstructor) {
          navigate('/instructor-dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 1000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setRegisterAsInstructor(false);
    setError('');
    setSuccess('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  // Initialize Google button for Sign Up tab
  useEffect(() => {
    let intervalId;
    const init = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return; // Avoid invalid_client when not configured
      if (activeTab !== 'register') return; 
      if (googleBtnRef.current && window.google && window.google.accounts && window.google.accounts.id) {
        try {
          // Clear existing content to avoid duplicate renders when switching tabs
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              const result = await loginWithGoogle(response.credential);
              if (result.success) navigate('/', { replace: true });
            }
          });
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          });
          if (intervalId) clearInterval(intervalId);
        } catch (e) {
          console.error('Google init error:', e);
        }
      }
    };
    init();
    if (!(window.google && window.google.accounts && window.google.accounts.id)) {
      intervalId = setInterval(init, 500);
      setTimeout(() => intervalId && clearInterval(intervalId), 10000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [activeTab, loginWithGoogle, navigate]);

  return (
    <div className="container-fluid" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 50%, #34495e 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 shadow-lg" 
                   style={{
                     width: '120px', 
                     height: '120px', 
                     background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                     boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
                   }}>
                <i className="fa fa-graduation-cap fa-3x" style={{color: '#000000'}}></i>
              </div>
              <h1 className="text-white fw-bold mb-3" style={{fontSize: '3rem', letterSpacing: '2px'}}>eLEARNING</h1>
              <p className="text-light fs-5" style={{color: 'var(--text-secondary)'}}>Professional Learning Platform</p>
            </div>

            {/* Auth Card */}
            <div className="card shadow-lg border-0" style={{
              borderRadius: '20px',
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 8px 32px rgba(52, 73, 94, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)'
            }}>
              <div className="card-body p-0">
                {/* Tab Navigation */}
                <div className="d-flex">
                  <button
                    className={`btn flex-fill py-4 ${activeTab === 'login' ? '' : ''}`}
                    onClick={() => switchTab('login')}
                    style={{
                      borderRadius: '20px 0 0 0',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      background: activeTab === 'login' ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : 'rgba(52, 73, 94, 0.8)',
                      color: activeTab === 'login' ? '#1a1a1a' : '#FFFFFF',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fa fa-sign-in-alt me-2"></i>
                    Sign In
                  </button>
                  <button
                    className={`btn flex-fill py-4 ${activeTab === 'register' ? '' : ''}`}
                    onClick={() => switchTab('register')}
                    style={{
                      borderRadius: '0 20px 0 0',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      background: activeTab === 'register' ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : 'rgba(52, 73, 94, 0.8)',
                      color: activeTab === 'register' ? '#1a1a1a' : '#FFFFFF',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fa fa-user-plus me-2"></i>
                    Sign Up
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-5">
                  {error && (
                    <div className="alert border-0 shadow-sm" role="alert" style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      color: '#ff6b6b',
                      border: '1px solid rgba(220, 53, 69, 0.3)'
                    }}>
                      <i className="fa fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert border-0 shadow-sm" role="alert" style={{
                      background: 'rgba(40, 167, 69, 0.2)',
                      color: '#51cf66',
                      border: '1px solid rgba(40, 167, 69, 0.3)'
                    }}>
                      <i className="fa fa-check-circle me-2"></i>
                      {success}
                    </div>
                  )}

                  {activeTab === 'login' ? (
                    <form onSubmit={handleLogin}>
                      <div className="mb-4">
                        <div className="form-floating">
                          <input 
                            type="email" 
                            name='email' 
                            className="form-control border-0 shadow-sm" 
                            id="loginEmail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                              borderRadius: '12px', 
                              height: '60px',
                              background: '#1a1a1a',
                              color: '#FFFFFF',
                              border: '2px solid rgba(255, 215, 0, 0.3)',
                              fontSize: '16px',
                              fontWeight: '500'
                            }}
                          />
                          <label htmlFor="loginEmail" style={{color: '#000000', fontWeight: '500'}}>
                            <i className="fa fa-envelope me-2"></i>Email Address
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="form-floating">
                          <input 
                            type="password" 
                            name='password' 
                            className="form-control border-0 shadow-sm" 
                            id="loginPassword"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                              borderRadius: '12px', 
                              height: '60px',
                              background: '#1a1a1a',
                              color: '#FFFFFF',
                              border: '2px solid rgba(255, 215, 0, 0.3)',
                              fontSize: '16px',
                              fontWeight: '500'
                            }}
                          />
                          <label htmlFor="loginPassword" style={{color: '#000000', fontWeight: '500'}}>
                            <i className="fa fa-lock me-2"></i>Password
                          </label>
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2 mt-4">
                        <button 
                          type="submit" 
                          className="btn btn-lg shadow-sm"
                          disabled={loading}
                          style={{
                            borderRadius: '15px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                            border: 'none',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#000000',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Signing In...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-sign-in-alt me-2"></i>
                              Sign In
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister}>
                      <div className="mb-4">
                        <div className="form-floating">
                          <input 
                            type="text" 
                            name='name' 
                            className="form-control border-0 shadow-sm" 
                            id="registerName"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                              borderRadius: '12px', 
                              height: '60px',
                              background: '#1a1a1a',
                              color: '#FFFFFF',
                              border: '2px solid rgba(255, 215, 0, 0.3)',
                              fontSize: '16px',
                              fontWeight: '500'
                            }}
                          />
                          <label htmlFor="registerName" style={{color: '#000000', fontWeight: '500'}}>
                            <i className="fa fa-user me-2"></i>Full Name
                          </label>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="form-floating">
                          <input 
                            type="email" 
                            name='email' 
                            className="form-control border-0 shadow-sm" 
                            id="registerEmail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                              borderRadius: '12px', 
                              height: '60px',
                              background: '#1a1a1a',
                              color: '#FFFFFF',
                              border: '2px solid rgba(255, 215, 0, 0.3)',
                              fontSize: '16px',
                              fontWeight: '500'
                            }}
                          />
                          <label htmlFor="registerEmail" style={{color: '#000000', fontWeight: '500'}}>
                            <i className="fa fa-envelope me-2"></i>Email Address
                          </label>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-floating">
                            <input 
                              type="password" 
                              name='password' 
                              className="form-control border-0 shadow-sm" 
                              id="registerPassword"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              minLength="6"
                              style={{
                                borderRadius: '12px', 
                                height: '60px',
                                background: '#1a1a1a',
                                color: '#FFFFFF',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                                fontSize: '16px',
                                fontWeight: '500'
                              }}
                            />
                            <label htmlFor="registerPassword" style={{color: '#000000', fontWeight: '500'}}>
                              <i className="fa fa-lock me-2"></i>Password
                            </label>
                          </div>
                          <small style={{color: '#000000'}}>
                            <i className="fa fa-info-circle me-1"></i>
                            Minimum 6 characters
                          </small>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                          <div className="form-floating">
                            <input 
                              type="password" 
                              name='confirmPassword' 
                              className="form-control border-0 shadow-sm" 
                              id="registerConfirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                              style={{
                                borderRadius: '12px', 
                                height: '60px',
                                background: '#1a1a1a',
                                color: '#FFFFFF',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                                fontSize: '16px',
                                fontWeight: '500'
                              }}
                            />
                            <label htmlFor="registerConfirmPassword" style={{color: '#000000', fontWeight: '500'}}>
                              <i className="fa fa-lock me-2"></i>Confirm Password
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Instructor Option */}
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="registerAsInstructor"
                          checked={registerAsInstructor}
                          onChange={(e) => setRegisterAsInstructor(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="registerAsInstructor" style={{color: '#000000'}}>
                          Register as Instructor
                        </label>
                        <div className="form-text" style={{color: '#000000'}}>Instructors can manage students, add course videos, and view assessment scores.</div>
                      </div>

                      <div className="d-grid gap-2 mt-2">
                        <button 
                          type="submit" 
                          className="btn btn-lg shadow-sm"
                          disabled={loading}
                          style={{
                            borderRadius: '15px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                            border: 'none',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#000000',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-user-plus me-2"></i>
                              Create Account
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick links */}
                      <div className="d-flex justify-content-center gap-3 mt-3">
                        <a href="/instructor-login" className="btn btn-sm btn-outline-secondary">
                          <i className="fa fa-chalkboard-teacher me-2"></i> Instructor Login
                        </a>
                      </div>

                      {/* Removed the 'or' text below the Create Account button */}
                      <div className="d-flex justify-content-center mt-3">
                        <div ref={googleBtnRef}></div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Features section removed as requested */}
          </div>
        </div>
      </div>

    </div>
  );
}
