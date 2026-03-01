import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    rating: 2,
    feedback: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [imageData, setImageData] = useState("");

  // Fetch all feedback on mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get("/api/feedback-file");
      setFeedbackData(res.data.feedback || []);
    } catch (err) {
      // fallback demo data
      setFeedbackData([
        {
          _id: "demo1",
          name: "John Doe",
          comment:
            "Great learning platform! The courses are well structured and easy to follow.",
          rating: 5,
          createdAt: new Date().toISOString(),
          image: "https://via.placeholder.com/150",
        },
      ]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result || "";
      setImagePreview(String(dataUrl));
      setImageData(String(dataUrl));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");
    setSuccess("");

    try {
      // Build payload expected by /api/feedback-file
      const payload = {
        name: formData.name,
        comment: formData.feedback,
        rating: formData.rating,
        image: imageData || "https://via.placeholder.com/150",
        // optional: include extra fields if backend ignores them
        email: formData.email,
        mobile: formData.mobile,
        category: formData.category,
      };

      const response = await axios.post("/api/feedback-file", payload);

      if (response.status === 201 || response.status === 200) {
        setSuccess("Feedback submitted successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          rating: 2,
          feedback: "",
          category: "",
        });
        setImagePreview("");
        setImageData("");
        fetchFeedback();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setError("Failed to submit feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

     
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 12px" }}>
          <div
            className="form-container"
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              className="text-center mb-4"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              <i className="fas fa-comments me-3 text-primary"></i>
              Share Your Feedback
            </h2>
            <p
              className="text-center text-muted mb-4"
              style={{ fontSize: "16px" }}
            >
              Help us improve our eLearning platform by sharing your thoughts
              and suggestions
            </p>

            {result && (
              <div
                className={`alert ${
                  result.includes("Thank you")
                    ? "alert-success"
                    : "alert-danger"
                }`}
                role="alert"
              >
                <i
                  className={`fas ${
                    result.includes("Thank you")
                      ? "fa-check-circle"
                      : "fa-exclamation-triangle"
                  } me-2`}
                ></i>
                {result}
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row: Your Name | Your Email */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Mobile No */}
              <div className="form-group mb-3">
                <label htmlFor="mobile">Mobile No</label>
                <input
                  type="tel"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  
                />
              </div>

              {/* Category */}
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="course-content">Course Content</option>
                  <option value="user-interface">User Interface</option>
                  <option value="performance">Performance</option>
                  <option value="support">Support</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="bug-report">Bug Report</option>
                  <option value="general">General Feedback</option>
                </select>
                <label htmlFor="category">Feedback Category</label>
              </div>

              {/* Profile Picture */}
              <div className="mb-3">
                <label htmlFor="imageInput" className="form-label">
                  Profile Picture
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="form-text">Choose a photo from your device</div>
              </div>
              {imagePreview && (
                <div className="mb-3 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    className="rounded-circle border"
                  />
                </div>
              )}

              {/* Star Rating */}
              <div className="mb-3">
                <Typography component="legend">Overall Rating</Typography>
                <Rating
                  name="rating"
                  value={Number(formData.rating) || 0}
                  onChange={(e, newValue) => {
                    if (typeof newValue === "number") {
                      setFormData((prev) => ({ ...prev, rating: newValue }));
                    }
                  }}
                />
              </div>

              {/* Message */}
              <div className="form-group mb-3">
                <label htmlFor="feedback">Message</label>
                <textarea
                  className="form-control"
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Type your message here"
                  required
                  style={{ height: "150px" }}
                ></textarea>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ padding: "10px 20px", fontSize: "16px" }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      {/* All feedback list */}
      <div className="container mt-5">
        <div className="text-center">
          <h6 className="section-title bg-white text-center text-primary px-3">
            All Feedbacks of Users
          </h6>
          <h1 className="mb-4">All Feedbacks</h1>
        </div>
        <div className="row justify-content-center">
          {feedbackData.map((item) => (
            <div
              key={item._id}
              className="col-md-5 ms-2 mt-3 card mb-3"
              style={{ maxWidth: "540px" }}
            >
              <div className="row g-0">
                <div className="col-md-3 mt-3 text-center">
                  <img
                    style={{ width: "6rem", height: "6rem", objectFit: "cover" }}
                    src={item.image}
                    className="d-block border rounded-circle p-2 mx-auto mb-3"
                    alt=""
                  />
                </div>
                <div className="col-md-8">
                  <p className="card-text mb-0 ps-3">
                    <small className="text-body-secondary">
                      {new Date(item.createdAt || item.date || Date.now()).toLocaleDateString(
                        "en-US",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </small>
                  </p>
                  <div className="card-body pt-0 mt-0">
                    <p className="card-text p-0 fw-bold">{item.name}</p>
                    <p className="card-text">{item.comment}</p>
                    <Rating name="read-only" value={item.rating} readOnly />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
