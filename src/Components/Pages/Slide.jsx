import React from "react";
import "../../assets/css/Slide.css";
import { Link } from "react-router-dom";

export default function Slide() {
  return (
    <>
      <div
        id="carouselExampleControlsNoTouching"
        className="carousel slide"
        data-bs-touch="false"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="owl-carousel-item position-relative">
              <img className="img-fluid" src="/img/carousel-2.jpg" alt="" />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-12 text-center">
                      <h6 className="text-uppercase mb-2" style={{
                        color: 'var(--accent-primary)',
                        fontWeight: '600',
                        letterSpacing: '2px'
                      }}>
                        Professional Learning
                      </h6>
                      <h1 className="display-4" style={{
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                        overflow: 'visible',
                        textOverflow: 'clip',
                        width: 'auto',
                        minWidth: 'max-content'
                      }}>
                        eLEARNING Platform
                      </h1>
                      <p className="fs-5 mb-4 pb-2" style={{
                        color: '#FFFFFF',
                        lineHeight: '1.7'
                      }}>
                        Welcome to eLEARNING, your professional gateway to limitless learning!
                        Discover a world of knowledge with our comprehensive range of
                        courses designed to empower and inspire. Start your
                        learning journey today and unlock your full potential!
                      </p>
                      <Link
                        to=""
                        className="btn py-md-3 px-md-3 me-4"
                        style={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderRadius: '8px'
                        }}
                      >
                        Read More
                      </Link>
                      <Link
                        to="/courses"
                        className="btn py-md-3 px-md-4"
                        style={{
                          background: 'transparent',
                          border: '2px solid #FFD700',
                          color: '#FFFFFF',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderRadius: '8px'
                        }}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div className="owl-carousel-item position-relative">
              <img className="img-fluid" src="/img/carousel-1.jpg" alt="" />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-12 text-center">
                      <h6 className="text-uppercase mb-2" style={{
                        color: 'var(--accent-primary)',
                        fontWeight: '600',
                        letterSpacing: '2px'
                      }}>
                        Expert Training
                      </h6>
                      <h1 className="display-4" style={{
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                        overflow: 'visible',
                        textOverflow: 'clip',
                        width: 'auto',
                        minWidth: 'max-content'
                      }}>
                        Professional Online Education
                      </h1>
                      <p className="fs-5 mb-4 pb-2" style={{
                        color: '#FFFFFF',
                        lineHeight: '1.7'
                      }}>
                        Unlock a world of possibilities with eLEARNING. Enroll now
                        to access our cutting-edge courses and elevate your
                        professional learning experience!
                      </p>
                      <Link
                        to=""
                        className="btn py-md-3 px-md-4 me-4"
                        style={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderRadius: '8px'
                        }}
                      >
                        Read More
                      </Link>
                      <Link
                        to="/courses"
                        className="btn py-md-3 px-md-4"
                        style={{
                          background: 'transparent',
                          border: '2px solid #FFD700',
                          color: '#FFFFFF',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderRadius: '8px'
                        }}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControlsNoTouching"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControlsNoTouching"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

    </>
  );
}
