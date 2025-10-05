import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../../contexts/AuthContext'
import '../../assets/css/sign.css'

export default function Register() {
    const { loginWithGoogle } = useAuth();
    const googleBtnRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        college: '',
        course: '',
        year: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;

        const tryInit = () => {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            if (!clientId) {
                // No client ID configured; skip initializing to avoid invalid_client
                return;
            }
            if (googleBtnRef.current && window.google && window.google.accounts && window.google.accounts.id) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: async (response) => {
                            const result = await loginWithGoogle(response.credential);
                            if (result.success) {
                                navigate('/');
                            }
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

        // Try immediately, then retry for up to ~10 seconds if script loads later
        tryInit();
        if (!(window.google && window.google.accounts && window.google.accounts.id)) {
            intervalId = setInterval(tryInit, 500);
            setTimeout(() => intervalId && clearInterval(intervalId), 10000);
        }

        return () => intervalId && clearInterval(intervalId);
    }, [loginWithGoogle, navigate]);

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

        try {
            const response = await axios.post('/api/auth/signup', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role,
                profile: {
                    college: formData.college,
                    course: formData.course,
                    year: formData.year
                }
            });

            if (response.status === 201) {
                // Auto-login after successful registration
                const { token, user } = response.data || {};
                if (token && user) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setSuccess('Registration successful! Redirecting...');

                // Route based on role
                const role = (response.data?.user?.role || formData.role || 'student').toLowerCase();
                if (role === 'instructor') {
                    navigate('/instructor-dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            
            <div className="container-fluid py-5" style={{
                background: '#1e2a36',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="form-container sign-simple" style={{
                    background: '#fff',
                    borderRadius: '10px',
                    padding: '30px',
                    width: '400px',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.3)'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">I am a</label>
                            <select
                                id="role"
                                name="role"
                                className="form-control"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                background: '#ffde00',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>Create Account</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}