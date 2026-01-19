import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReviewSection({ cakeName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchRating();
  }, [cakeName]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/cake/${encodeURIComponent(cakeName)}`);
      setReviews(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/rating/${encodeURIComponent(cakeName)}`);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!customerName.trim() || !rating || !comment.trim()) {
      setMessage('⚠️ Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        cakeName,
        customerName: customerName.trim(),
        email: email.trim() || 'Anonymous',
        rating: Number(rating),
        comment: comment.trim()
      };

      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        reviewData
      );

      if (response.status === 201) {
        setMessage('✅ Review posted successfully!');
        setCustomerName('');
        setEmail('');
        setRating(5);
        setComment('');
        setShowForm(false);

        // Refresh reviews and rating
        setTimeout(() => {
          fetchReviews();
          fetchRating();
          setMessage('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('❌ Failed to post review. Try again!');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>⭐ Customer Reviews</h3>
        
        {/* Average Rating Display */}
        <div className="rating-summary">
          {totalReviews > 0 ? (
            <>
              <div className="average-rating-display">
                <span className="rating-number">{averageRating}</span>
                <span className="rating-stars">{renderStars(Math.round(averageRating))}</span>
                <span className="review-count">({totalReviews} reviews)</span>
              </div>
            </>
          ) : (
            <p className="no-reviews-yet">No reviews yet. Be the first to review!</p>
          )}
        </div>

        <button 
          className="review-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '✏️ Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="review-form">
          <h4>Share Your Experience</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    disabled={submitting}
                  >
                    ★
                  </button>
                ))}
                <span className="rating-text">{rating} out of 5</span>
              </div>
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                placeholder="Share your thoughts about this cake..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                rows="4"
                required
              ></textarea>
            </div>

            {message && (
              <p className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}

            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? '⏳ Posting...' : '🚀 Post Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <p className="loading">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this cake!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header-card">
                <div className="reviewer-info">
                  <h5>{review.customerName}</h5>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
