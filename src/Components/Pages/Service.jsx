import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Service() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const goOnlineClasses = () => {
    // If instructor/admin -> start a new classroom with a generated room id
    if (isAuthenticated && (user?.role === 'instructor' || user?.role === 'admin')) {
      const roomId = 'room_' + Date.now().toString(36);
      navigate(`/live/classroom/${roomId}`);
      return;
    }
    // Students/viewers -> ask for room id to join projector
    const rid = window.prompt('Enter class room code provided by your instructor');
    if (rid && rid.trim()) navigate(`/live/projector/${rid.trim()}`);
  };

  const goHomeProjects = () => {
    // Use the same projector viewer (idea: showcase/home projection)
    const rid = window.prompt('Enter room code to view the instructor projection');
    if (rid && rid.trim()) navigate(`/live/projector/${rid.trim()}`);
  };
  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item text-center pt-3">
                <Link to="/test">
                  <div className="p-4">
                    <i className="fa fa-3x fa-graduation-cap text-primary mb-4" />
                    <h5 className="mb-3">Online Assessment</h5>
                    <p>Online assessment enhanced with AI provides a personalized evaluation of your skills to enhance your learning and development.</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item text-center pt-3">
                <button onClick={goOnlineClasses} className="btn p-0 w-100" style={{background:'transparent', border:'none'}}>
                  <div className="p-4">
                    <i className="fa fa-3x fa-globe text-primary mb-4" />
                    <h5 className="mb-3">Online Classes</h5>
                    <p>Take advantage of our online classes to expand your knowledge and skills.</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item text-center pt-3">
                <button onClick={goHomeProjects} className="btn p-0 w-100" style={{background:'transparent', border:'none'}}>
                  <div className="p-4">
                    <i className="fa fa-3x fa-home text-primary mb-4" />
                    <h5 className="mb-3">Home Projects</h5>
                    <p>Transform your living space with these creative home project ideas that are sure to inspire.</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item text-center pt-3">
                <Link to="/library">
                  <div className="p-4">
                    <i className="fa fa-3x fa-book-open text-primary mb-4" />
                    <h5 className="mb-3">Book Library</h5>
                    <p>Our e-library offers a diverse range of e-books and digital resources to cater to every interest and age group.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
