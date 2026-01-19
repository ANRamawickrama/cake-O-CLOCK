import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ReviewsPage.css";

function ReviewsPage() {
  const [allReviews, setAllReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCake, setFilterCake] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [cakesWithStats, setCakesWithStats] = useState([]);

  const CAKE_TYPES = [
    "Birthday Cake",
    "Anniversary Cake",
    "Cupcake",
    "Wedding Cake",
    "Wedding Structure",
    "Jar Cake"
  ];

  useEffect(() => {
    fetchAllReviews();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allReviews, searchTerm, filterCake, sortBy]);

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      setAllReviews(response.data || []);
      
      // Calculate stats for each cake type
      const stats = {};
      CAKE_TYPES.forEach(cake => {
        const cakeReviews = (response.data || []).filter(r => r.cakeName === cake);
        const avgRating = cakeReviews.length > 0 
          ? (cakeReviews.reduce((sum, r) => sum + r.rating, 0) / cakeReviews.length).toFixed(1)
          : 0;
        stats[cake] = {
          count: cakeReviews.length,
          average: avgRating
        };
      });
      setCakesWithStats(stats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allReviews];

    // Filter by cake type
    if (filterCake !== "All") {
      filtered = filtered.filter(review => review.cakeName === filterCake);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.cakeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < rating ? "filled" : "empty"}`}>
            ★
          </span>
        ))}
        <span className="rating-value">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <div style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem" }}>
          Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>🎂 Customer Reviews & Ratings</h1>
        <p className="reviews-subtitle">
          See what our customers love about our cakes!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <h2>Cake Ratings Overview</h2>
        <div className="stats-grid">
          {CAKE_TYPES.map(cake => (
            <div key={cake} className="stat-card">
              <h3>{cake}</h3>
              <div className="stat-info">
                <div className="stat-rating">
                  ⭐ {cakesWithStats[cake]?.average || 0}
                </div>
                <div className="stat-count">
                  {cakesWithStats[cake]?.count || 0} reviews
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="reviews-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search reviews by name, cake, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="controls-row">
          <select
            value={filterCake}
            onChange={(e) => setFilterCake(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Cakes</option>
            {CAKE_TYPES.map(cake => (
              <option key={cake} value={cake}>{cake}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-container">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <p>😊 No reviews found. Be the first to review!</p>
          </div>
        ) : (
          <div>
            <p className="reviews-count">
              Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
            </p>
            <div className="reviews-list">
              {filteredReviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="review-meta">
                      <h3 className="reviewer-name">{review.customerName}</h3>
                      <span className="cake-badge">{review.cakeName}</span>
                    </div>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>

                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>

                  {review.email && review.email !== "Anonymous" && (
                    <p className="review-email">✉️ {review.email}</p>
                  )}

                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
