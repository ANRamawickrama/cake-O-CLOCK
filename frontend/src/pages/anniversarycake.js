import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../component/ReviewSection";
import { AnniversaryCakes } from "../helpers/AnniversaryList";
import "../styles/AnniversaryList.css";
import "../styles/ReviewSection.css";

function AnniversaryCake() {
  const [cakes, setCakes] = useState([...AnniversaryCakes]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState(null);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/api/cakes/type/Anniversary Cake`);
      if (response.data && response.data.length > 0) {
        setCakes([...AnniversaryCakes, ...response.data]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cakes:", error);
      setLoading(false);
    }
  };

  return (
    <div className="anniversaryPage">
      <h1 className="anniversaryTitle">Choose your design in here...</h1>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading cakes...</p>}

      {selectedCake ? (
        <div className="cake-detail-view">
          <button className="back-btn" onClick={() => setSelectedCake(null)}>← Back to Cakes</button>
          <div className="cake-detail-container">
            <div className="cake-detail-image">
              <img src={selectedCake.image} alt={selectedCake.name || "Anniversary Cake"} />
            </div>
            <div className="cake-detail-info">
              <h2>{selectedCake.name || `Anniversary Cake`}</h2>
              <p className="cake-price">Price: <strong>Rs {selectedCake.price}</strong></p>
              <Link to="/order" state={{ cake: { ...selectedCake, name: selectedCake.name || `Anniversary Cake` } }}>
                <button className="order-btn">🛒 Order Now</button>
              </Link>
            </div>
          </div>
          <ReviewSection cakeName={selectedCake.name || `Anniversary Cake`} />
        </div>
      ) : (
        <div className="anniversaryLists">
          {cakes.map((cake, index) => (
            <div key={index} className="cakeItem">
              <img src={cake.image} alt={cake.name || `Anniversary Cake ${index + 1}`} />
              {cake.price && <p>Rs {cake.price}</p>}
              <div className="cake-item-buttons">
                <Link to="/order" state={{ cake: { ...cake, name: cake.name || `Anniversary Cake ${index + 1}` } }}>
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

export default AnniversaryCake;
