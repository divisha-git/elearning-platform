import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  // No theme toggle: use original static color combo

  // Clear any previously set theme attributes/localStorage
  useEffect(() => {
    try {
      document.documentElement.removeAttribute('data-theme');
      if (document.body) document.body.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } catch {}
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleJoinNow = () => {
    navigate('/auth');
  };

  // Instructor payment notifications removed

  // Original static styles (yellow on dark navbar)
  const navbarStyle = {
    backgroundColor: '#1a1a1a',
    borderBottom: '3px solid #FFD700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minHeight: '80px'
  };

  const brandStyle = {
    color: '#FFD700',
    fontWeight: '800',
    fontSize: '1.9rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  };

  const navLinkStyle = {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '12px 20px',
    transition: 'all 0.3s ease',
    borderRadius: '6px',
    margin: '0 2px'
  };

  const navLinkHoverStyle = {
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateY(-2px)'
  };

  const dropdownStyle = {
    backgroundColor: '#2a2a2a',
    border: '2px solid #FFD700',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    marginTop: '8px'
  };

  const dropdownItemStyle = {
    color: '#FFFFFF',
    fontWeight: '500',
    padding: '12px 20px',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderRadius: '25px',
    padding: '12px 30px',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease'
  };

  const profileLinkStyle = {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: '1rem',
    padding: '10px 15px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    border: '2px solid #FFD700'
  };

  const togglerStyle = {
    border: '2px solid #FFD700',
    borderRadius: '6px',
    padding: '8px 12px'
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark shadow sticky-top p-0`} style={navbarStyle}>
        <Link
          to={user?.role === 'instructor' ? '/instructor-dashboard' : '/'}
          className="navbar-brand d-flex align-items-center px-4 px-lg-5"
        >
          <h2 className="m-0" style={brandStyle}>
            <i className="fa fa-book me-3"></i>eLEARNING
          </h2>
        </Link>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          style={togglerStyle}
        >
          <span className="navbar-toggler-icon" style={{filter: 'brightness(0) saturate(100%) invert(85%) sepia(100%) saturate(348%) hue-rotate(15deg) brightness(101%) contrast(103%)'}}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            {!(isAuthenticated && user?.role === 'instructor') && (
            <>
            <NavLink
              to="/"
              className="nav-item nav-link"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, navLinkHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, navLinkStyle);
              }}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="nav-item nav-link"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, navLinkHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, navLinkStyle);
              }}
            >
              About
            </NavLink>
            <NavLink
              to="/courses"
              className="nav-item nav-link"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, navLinkHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, navLinkStyle);
              }}
            >
              Courses
            </NavLink>
            <div className="nav-item dropdown">
              <NavLink
                to="/pages"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, navLinkHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, navLinkStyle);
                }}
              >
                Pages
              </NavLink>
              <div className="dropdown-menu fade-down m-0" style={dropdownStyle}>
                <NavLink
                  to="/team"
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                    e.target.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#FFFFFF';
                  }}
                >
                  Our Team
                </NavLink>
                <NavLink
                  to="/testimonial"
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                    e.target.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = isDark ? '#FFFFFF' : '#1a1a1a';
                  }}
                >
                  Testimonial
                </NavLink>
                <NavLink
                  to="/feedback"
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                    e.target.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = isDark ? '#FFFFFF' : '#1a1a1a';
                  }}
                >
                  Feedback
                </NavLink>
              </div>
            </div>
            <NavLink
              to="/contact"
              className="nav-item nav-link"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, navLinkHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, navLinkStyle);
              }}
            >
              Contact
            </NavLink>
            </>
            )}
          </div>

          {/* Payment notifications (bell) removed */}

          {isAuthenticated && (
            <div className="nav-item dropdown me-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={profileLinkStyle}
              >
                <i className="fa fa-user me-2"></i>{user.name}
              </a>
              <div className="dropdown-menu dropdown-menu-end" style={{backgroundColor: '#2a2a2a', border: '1px solid #FFD700'}}>
                {user?.role !== 'instructor' && (
                  <NavLink
                    to="/profile"
                    className="dropdown-item"
                    style={{color: '#FFFFFF', padding: '10px 20px'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                      e.target.style.color = '#FFD700';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = isDark ? '#FFFFFF' : '#1a1a1a';
                    }}
                  >
                    <i className="fa fa-user me-2"></i>Profile
                  </NavLink>
                )}
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <NavLink
                    to="/instructor-dashboard"
                    className="dropdown-item"
                    style={{color: '#FFFFFF', padding: '10px 20px'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                      e.target.style.color = '#FFD700';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = isDark ? '#FFFFFF' : '#1a1a1a';
                    }}
                  >
                    <i className="fa fa-chalkboard-teacher me-2"></i>Instructor Dashboard
                  </NavLink>
                )}
              </div>
            </div>
          )}
          
          {!isAuthenticated && (
            <>
              <NavLink
                to="/auth"
                className="nav-item nav-link me-2"
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, navLinkHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, navLinkStyle);
                }}
              >
                <i className="fa fa-sign-in-alt me-2"></i>Student Login
              </NavLink>
              <NavLink
                to="/instructor-login"
                className="nav-item nav-link me-3"
                style={{...navLinkStyle, color: '#FFD700', fontWeight: '700'}}
                onMouseEnter={(e) => {
                  e.target.style.color = '#FFFFFF';
                  e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#FFD700';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="fa fa-chalkboard-teacher me-2"></i>Instructor Login
              </NavLink>
            </>
          )}

          {isAuthenticated ? (
            <button
              className="btn d-none d-lg-block me-4"
              onClick={handleLogout}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
              }}
            >
              <i className="fa fa-sign-out-alt me-2"></i>Log Out
            </button>
          ) : (
            <button
              className="btn d-none d-lg-block me-4"
              onClick={handleJoinNow}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
              }}
            >
              <i className="fa fa-rocket me-2"></i>Join Now
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
