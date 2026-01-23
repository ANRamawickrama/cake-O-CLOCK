import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../component/ReviewSection";
import WeddingCakeImage from "../assets/weddingcake.jpg";
import "../styles/Cupcake.css";
import "../styles/ReviewSection.css";

function Weddingcake() {
  const [cakes, setCakes] = useState([
    { image: WeddingCakeImage, price: 8000, name: "Wedding Cake" }
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState(null);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/api/cakes/type/${encodeURIComponent('Wedding Cake')}`);
      console.log("Wedding cakes API response:", response.data);
      if (response.data && response.data.length > 0) {
        // Combine default cakes with uploaded cakes
        setCakes([
          { image: WeddingCakeImage, price: 8000, name: "Wedding Cake" },
          ...response.data
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Wedding cakes:", error);
      setLoading(false);
    }
  };

  return (
    <div className="cupcakePage">
      <h1 className="cupcakeTitle">Our Wedding Cakes</h1>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading cakes...</p>}

      {selectedCake ? (
        <div className="cake-detail-view">
          <button className="back-btn" onClick={() => setSelectedCake(null)}>← Back to Cakes</button>
          <div className="cake-detail-container">
            <div className="cake-detail-image">
              <img src={selectedCake.image} alt={selectedCake.name || "Wedding Cake"} />
            </div>
            <div className="cake-detail-info">
              <h2>{selectedCake.name || `Wedding Cake`}</h2>
              <p className="cake-price">Price: <strong>Rs {selectedCake.price}</strong></p>
              <Link to="/order" state={{ cake: { ...selectedCake, name: selectedCake.name || `Wedding Cake` } }}>
                <button className="order-btn">🛒 Order Now</button>
              </Link>
            </div>
          </div>
          <ReviewSection cakeName={selectedCake.name || `Wedding Cake`} />
        </div>
      ) : (
        <div className="cupcakeLists">
          {cakes.map((cake, index) => (
            <div key={index} className="cakeItem">
              <img src={cake.image} alt={cake.name || `Wedding Cake ${index + 1}`} />
              <p>Rs {cake.price}</p>
              <div className="cake-item-buttons">
                <Link to="/order" state={{ cake: { ...cake, name: cake.name || `Wedding Cake ${index + 1}` } }}>
                  <button className="order-small-btn">Order</button>
                </Link>
                <button 
                  className="review-small-btn"
                  onClick={() => setSelectedCake(cake)}
                >
                  Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weddingcake;
