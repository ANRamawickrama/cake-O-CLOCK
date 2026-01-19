import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../component/ReviewSection";
import { weddingStructure } from "../helpers/StructureList";
import "../styles/StructureList.css";
import "../styles/ReviewSection.css";

function WeddingStructures() {
  const [cakes, setCakes] = useState([...weddingStructure]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState(null);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cakes/type/Wedding Structure");
      if (response.data && response.data.length > 0) {
        setCakes([...weddingStructure, ...response.data]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cakes:", error);
      setLoading(false);
    }
  };

  return (
    <div className="structurePage">
      <h1 className="structureTitle">Choose your design in here...</h1>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading cakes...</p>}

      {selectedCake ? (
        <div className="cake-detail-view">
          <button className="back-btn" onClick={() => setSelectedCake(null)}>← Back to Cakes</button>
          <div className="cake-detail-container">
            <div className="cake-detail-image">
              <img src={selectedCake.image} alt={selectedCake.name || "Wedding Structure"} />
            </div>
            <div className="cake-detail-info">
              <h2>{selectedCake.name || `Wedding Structure`}</h2>
              <p className="cake-price">Price: <strong>Rs {selectedCake.price}</strong></p>
              <Link to="/order" state={{ cake: { ...selectedCake, name: selectedCake.name || `Wedding Structure` } }}>
                <button className="order-btn">🛒 Order Now</button>
              </Link>
            </div>
          </div>
          <ReviewSection cakeName={selectedCake.name || `Wedding Structure`} />
        </div>
      ) : (
        <div className="structureLists">
          {cakes.map((cake, index) => (
            <div key={index} className="cakeItem">
              <img src={cake.image} alt={cake.name || `Cake ${index + 1}`} />
              <p>Rs {cake.price}</p>
              <div className="cake-item-buttons">
                <Link to="/order" state={{ cake: { ...cake, name: cake.name || `Wedding Structure ${index + 1}` } }}>
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

export default WeddingStructures;