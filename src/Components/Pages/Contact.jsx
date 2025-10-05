import React, { useState } from "react";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Contact() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const onHCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("Sending....");

    try {
      const formData = new FormData(event.target);
      
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        subject: formData.get('subject') || 'New Contact Form Submission'
      };

      console.log('Sending contact data:', contactData);
      const response = await axios.post('http://localhost:3000/api/contact', contactData);
      console.log('Contact response:', response.data);

      if (response.status === 201) {
        setResult("Message sent successfully! We will get back to you soon.");
        event.target.reset();
        setCaptchaToken("");
      }

    } catch (error) {
      console.error('Contact form error:', error);
      console.error('Error response:', error.response);
      if (error.code === 'ECONNREFUSED') {
        setResult("Cannot connect to server. Please try again later or contact us directly.");
      } else if (error.response?.status === 500) {
        setResult("Server error occurred. Please try again later.");
      } else {
        setResult(error.response?.data?.message || "Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Contact Us
            </h6>
            <h1 className="mb-5">Contact For Any Query</h1>
          </div>
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <h5>Get In Touch</h5>
              <p className="mb-4">
                Send us a message using the contact form and we'll get back to you soon!
              </p>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="fa fa-map-marker-alt text-white" />
                </div>
                <div className="ms-3">
                  <h5 className="text-primary">Office</h5>
                  <p className="mb-0">Kongu Engineering College, Perundurai, Tamil Nadu</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="fa fa-phone-alt text-white" />
                </div>
                <div className="ms-3">
                  <h5 className="text-primary">Mobile</h5>
                  <p className="mb-0">+91 705 088 9705</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="fa fa-envelope-open text-white" />
                </div>
                <div className="ms-3">
                  <h5 className="text-primary">Email</h5>
                  <p className="mb-0">elearning@gmail.com</p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.268726789084!2d77.31740731482394!3d11.341000091896598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f46762f4671%3A0x8b1c8b1c8b1c8b1c!2sKongu%20Engineering%20College!5e0!3m2!1sen!2sin!4v1710127521636!5m2!1sen!2sin"
                frameBorder={0}
                style={{ minHeight: "300px", border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              />
            </div>
            <div
              className="col-lg-4 col-md-12 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <form onSubmit={onSubmit}>
                <input type="hidden" name="from_name" value="eLearning" />

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                       
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Your Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Mobile No</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        inputMode="numeric"
                        pattern="[0-9]{10,15}"
                      
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        style={{ height: "100px" }}
                        placeholder="Type your message here"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name="subject"
                    value="New Submission from contact page"
                  ></input>
                  <div className="col-8">
                    <HCaptcha
                      sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                      reCaptchaCompat={false}
                      onVerify={onHCaptchaChange}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </div>
              </form>
              <span>{result}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
