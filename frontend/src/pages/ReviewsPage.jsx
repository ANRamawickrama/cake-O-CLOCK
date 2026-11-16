import React, { useCallback, useEffect, useMemo, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import api, { apiErrorMessage } from "../services/api";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import "../styles/ReviewsPage.css";

const CAKE_TYPES = CAKE_CATEGORIES.map((category) => category.type);

function ReviewsPage() {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCake, setFilterCake] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const fetchAllReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/reviews");
      setAllReviews(data || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load reviews."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const cakesWithStats = useMemo(() => {
    const stats = {};
    CAKE_TYPES.forEach((cake) => {
      const cakeReviews = allReviews.filter((r) => r.cakeName === cake);
      const average =
        cakeReviews.length > 0
          ? (
              cakeReviews.reduce((sum, r) => sum + r.rating, 0) /
              cakeReviews.length
            ).toFixed(1)
          : 0;
      stats[cake] = { count: cakeReviews.length, average };
    });
    return stats;
  }, [allReviews]);

  const filteredReviews = useMemo(() => {
    let filtered = [...allReviews];

    if (filterCake !== "All") {
      filtered = filtered.filter((review) => review.cakeName === filterCake);
    }

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(
        (review) =>
          review.customerName?.toLowerCase().includes(term) ||
          review.cakeName?.toLowerCase().includes(term) ||
          review.comment?.toLowerCase().includes(term)
      );
    }

    switch (sortBy) {
      case "oldest":
        return filtered.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "highest":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return filtered.sort((a, b) => a.rating - b.rating);
      default:
        return filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  }, [allReviews, searchTerm, filterCake, sortBy]);

  const overallAverage = useMemo(() => {
    if (allReviews.length === 0) return "0.0";
    const total = allReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / allReviews.length).toFixed(1);
  }, [allReviews]);

  const renderStars = (rating) => (
    <span className="star-rating" aria-label={`${rating} out of 5`}>
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          fontSize="inherit"
          className={index < rating ? "star filled" : "star empty"}
        />
      ))}
    </span>
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="reviews-loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="container">
        <header className="reviews-header">
          <p className="eyebrow">Customer reviews</p>
          <h1 className="reviews-title">What people say about our cakes</h1>
          <p className="reviews-subtitle">
            Real feedback from the celebrations we have baked for.
          </p>

          <div className="reviewsOverview">
            <div className="reviewsOverviewScore">
              <strong>{overallAverage}</strong>
              {renderStars(Math.round(Number(overallAverage)))}
              <span>{allReviews.length} reviews</span>
            </div>
          </div>
        </header>

        {error && <div className="alert alert-error reviewsAlert">{error}</div>}

        <div className="stats-section">
          <h2 className="stats-title">Ratings by collection</h2>
          <div className="stats-grid">
            {CAKE_TYPES.map((cake) => (
              <div key={cake} className="stat-card">
                <h3>{cake}</h3>
                <div className="stat-info">
                  <div className="stat-rating">
                    <StarIcon fontSize="small" />
                    {cakesWithStats[cake]?.average || 0}
                  </div>
                  <div className="stat-count">
                    {cakesWithStats[cake]?.count || 0} reviews
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-controls">
          <div className="search-box">
            <SearchIcon fontSize="small" />
            <label className="srOnly" htmlFor="reviews-search">
              Search reviews
            </label>
            <input
              id="reviews-search"
              type="search"
              placeholder="Search by name, cake or comment..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="controls-row">
            <select
              value={filterCake}
              onChange={(event) => setFilterCake(event.target.value)}
              className="filter-select"
              aria-label="Filter by collection"
            >
              <option value="All">All collections</option>
              {CAKE_TYPES.map((cake) => (
                <option key={cake} value={cake}>
                  {cake}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="filter-select"
              aria-label="Sort reviews"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
        </div>

        <div className="reviews-container">
          {filteredReviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews found. Be the first to review!</p>
            </div>
          ) : (
            <>
              <p className="reviews-count">
                Showing {filteredReviews.length} review
                {filteredReviews.length !== 1 ? "s" : ""}
              </p>
              <div className="reviews-list">
                {filteredReviews.map((review, index) => (
                  <article key={review._id || index} className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <h3 className="reviewer-name">{review.customerName}</h3>
                        <span className="cake-badge">{review.cakeName}</span>
                      </div>
                      <span className="review-date">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span className="rating-value">{review.rating}/5</span>
                    </div>

                    {review.email && review.email !== "Anonymous" && (
                      <p className="review-email">✉️ {review.email}</p>
                    )}

                    <p className="review-comment">{review.comment}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;
