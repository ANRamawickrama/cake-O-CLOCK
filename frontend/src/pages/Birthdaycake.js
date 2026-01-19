import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../component/ReviewSection";
import { BirthdayCakes } from "../helpers/BirthdayLists";
import "../styles/BirthdayList.css";
import "../styles/ReviewSection.css";

function BirthdayCake() {
  const [cakes, setCakes] = useState([...BirthdayCakes]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState(null);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/api/cakes/type/Birthday Cake`);
      if (response.data && response.data.length > 0) {
        // Combine default cakes with uploaded cakes
        setCakes([...BirthdayCakes, ...response.data]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cakes:", error);
      setLoading(false);
    }
  };

  return (
    <div className="birthdayPage">
      <h1 className="birthdayTitle">Choose your design in here...</h1>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading cakes...</p>}

      {selectedCake ? (
        <div className="cake-detail-view">
          <button className="back-btn" onClick={() => setSelectedCake(null)}>← Back to Cakes</button>
          <div className="cake-detail-container">
            <div className="cake-detail-image">
              <img src={selectedCake.image} alt={selectedCake.name || "Birthday Cake"} />
            </div>
            <div className="cake-detail-info">
              <h2>{selectedCake.name || `Birthday Cake`}</h2>
              <p className="cake-price">Price: <strong>Rs {selectedCake.price}</strong></p>
              <Link to="/order" state={{ cake: { ...selectedCake, name: selectedCake.name || `Birthday Cake` } }}>
                <button className="order-btn">🛒 Order Now</button>
              </Link>
            </div>
          </div>
          <ReviewSection cakeName={selectedCake.name || `Birthday Cake`} />
        </div>
      ) : (
        <div className="birthdayLists">
          {cakes.map((cake, index) => (
            <div key={index} className="cakeItem">
              <img src={cake.image} alt={cake.name || `Cake ${index + 1}`} />
              <p>Rs {cake.price}</p>
              <div className="cake-item-buttons">
                <Link to="/order" state={{ cake: { ...cake, name: cake.name || `Birthday Cake ${index + 1}` } }}>
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

export default BirthdayCake;
