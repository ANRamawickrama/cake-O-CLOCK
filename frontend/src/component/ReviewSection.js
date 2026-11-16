import React, { useCallback, useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CloseIcon from "@mui/icons-material/Close";
import api, { apiErrorMessage } from "../services/api";
import "../styles/ReviewSection.css";

export default function ReviewSection({ cakeName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/api/reviews/cake/${encodeURIComponent(cakeName)}`
      );
      setReviews(data || []);
    } catch (error) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [cakeName]);

  const fetchRating = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/api/reviews/rating/${encodeURIComponent(cakeName)}`
      );
      setAverageRating(Number(data.averageRating) || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      setAverageRating(0);
      setTotalReviews(0);
    }
  }, [cakeName]);

  useEffect(() => {
    fetchReviews();
    fetchRating();
  }, [fetchReviews, fetchRating]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!customerName.trim() || !rating || !comment.trim()) {
      setMessageType("error");
      setMessage("Please fill in all the required fields.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/reviews", {
        cakeName,
        customerName: customerName.trim(),
        email: email.trim() || "Anonymous",
        rating: Number(rating),
        comment: comment.trim(),
      });

      setCustomerName("");
      setEmail("");
      setRating(5);
      setComment("");
      setShowForm(false);
      setMessageType("success");
      setMessage("Thanks! Your review is live.");

      await Promise.all([fetchReviews(), fetchRating()]);
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessageType("error");
      setMessage(apiErrorMessage(error, "Failed to post review. Try again!"));
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value) => (
    <span className="rs-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          fontSize="inherit"
          className={star <= value ? "rs-starFilled" : "rs-starEmpty"}
        />
      ))}
    </span>
  );

  return (
    <div className="rs-section">
      <div className="rs-header">
        <h3 className="rs-title">Customer reviews</h3>

        {totalReviews > 0 ? (
          <div className="rs-summary">
            <span className="rs-summaryNumber">{averageRating}</span>
            <span className="rs-summaryMeta">
              {renderStars(Math.round(averageRating))}
              <span className="rs-summaryCount">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </span>
          </div>
        ) : (
          <p className="rsEmpty">No reviews yet — be the first!</p>
        )}

        <button
          type="button"
          className="btn btn-outline btn-sm rs-toggle"
          onClick={() => setShowForm((open) => !open)}
        >
          {showForm ? <CloseIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />}
          {showForm ? "Close" : "Write a review"}
        </button>
      </div>

      {showForm && (
        <form className="rs-form" onSubmit={handleSubmitReview}>
          <div className="rs-formGrid">
            <div className="field">
              <label htmlFor="rs-name">Your name</label>
              <input
                id="rs-name"
                type="text"
                placeholder="Jane Perera"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="rs-email">Email (optional)</label>
              <input
                id="rs-email"
                type="email"
                placeholder="jane@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="field">
            <label>Your rating</label>
            <div className="rs-ratingSelector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rs-starBtn ${star <= rating ? "isActive" : ""}`}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <StarIcon fontSize="inherit" />
                </button>
              ))}
              <span className="rs-ratingText">{rating} out of 5</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="rs-comment">Your review</label>
            <textarea
              id="rs-comment"
              placeholder="Tell others how it tasted and looked..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={submitting}
              rows="4"
              required
            />
          </div>

          {message && (
            <p className={`alert ${messageType === "success" ? "alert-success" : "alert-error"}`}>
              {message}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Posting..." : "Post review"}
          </button>
        </form>
      )}

      {message && !showForm && (
        <p className={`alert ${messageType === "success" ? "alert-success" : "alert-error"}`}>
          {message}
        </p>
      )}

      <div className="rs-list">
        {loading ? (
          <p className="rsEmpty">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="rsEmpty">No reviews for this collection yet.</p>
        ) : (
          reviews.map((review, index) => (
            <article key={review._id || index} className="rs-card">
              <div className="rs-cardHead">
                <div>
                  <h4 className="rs-cardName">{review.customerName}</h4>
                  <span className="rs-cardDate">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="rs-cardComment">{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
