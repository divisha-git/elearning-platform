import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import axios from 'axios'
import '../../assets/css/sign.css'

export default function Sign() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', { email: formData.email });
            
            const response = await axios.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Login response:', response.data);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect to dashboard or home page
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'ECONNREFUSED') {
                setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
            } else {
                setError(error.response?.data?.message || `Login failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            
            <div className="container-fluid py-5" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-6">
                            <div className="card shadow-lg border-0" style={{
                                borderRadius: '16px',
                                background: 'rgba(255, 255, 255, 0.97)',
                                backdropFilter: 'blur(10px)',
                                maxWidth: '420px',
                                margin: '0 auto'
                            }}>
                                <div className="card-body p-4 sign-simple">
                                    <div className="text-center mb-5">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-4" 
                                             style={{width: '56px', height: '56px'}}>
                                            <i className="fa fa-sign-in-alt fa-2x text-white"></i>
                                        </div>
                                        <h2 className="fw-bold text-primary mb-2" style={{fontSize: '1.5rem'}}>Welcome Back</h2>
                                        <p className="text-muted" style={{fontSize: '0.95rem'}}>Sign in to continue your learning journey</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {error && (
                                            <div className="alert alert-danger border-0 shadow-sm" role="alert">
                                                <i className="fa fa-exclamation-triangle me-2"></i>
                                                {error}
                                            </div>
                                        )}
                                        
                                        <div className="mb-4 form-group">
                                            <input 
                                                type="email" 
                                                name='email' 
                                                className="form-control"
                                                id="email"
                                                placeholder="name@example.com"
                                                aria-label="Email Address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            <div className="form-text mt-1">
                                                <i className="fa fa-envelope me-2"></i>Email Address
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4 form-group">
                                            <label htmlFor="password" className="form-label">
                                                <i className="fa fa-lock me-2"></i>Password
                                            </label>
                                            <input 
                                                type="password" 
                                                name='password' 
                                                className="form-control"
                                                id="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="d-grid gap-2 mt-3">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary btn-lg shadow-sm"
                                                disabled={loading}
                                                style={{
                                                    borderRadius: '12px',
                                                    height: '52px',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    fontSize: '16px',
                                                    fontWeight: '600'
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
                                        
                                        <div className="text-center mt-4">
                                            <p className="text-muted mb-0">
                                                Don't have an account? 
                                                <Link to="/register" className="text-primary text-decoration-none fw-bold ms-1">
                                                    Sign Up
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
