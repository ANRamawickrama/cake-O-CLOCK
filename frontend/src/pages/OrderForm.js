import React, { useState } from "react";
import BannerImage from "../assets/homee.jpg";
import { useLocation } from "react-router-dom";
import "../styles/OrderForm.css";

function OrderForm() {
  const location = useLocation();
  const cake = location.state?.cake;

  const [userLocation, setUserLocation] = useState("");

  // 📍 Function to get user’s GPS location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        (error) => {
          alert("Unable to retrieve your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="orderPage" style={{ backgroundImage: `url(${BannerImage})` }}>
      {cake && (
        <div className="selectedCake">
          <img src={cake.image} alt={cake.name} />
          <h2>{cake.name}</h2>
          <p>Price: Rs {cake.price}</p>
        </div>
      )}

      <form className="orderForm">
        <h1 className="orderTitle">Cake Order Form</h1>
        <input type="text" placeholder="Full Name" required />
        <input type="text" placeholder="Contact Number" required />

        {/* 📍 Location field */}
        <div className="locationField">
          <input
            type="text"
            placeholder="Your Location / Delivery Address"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            required
          />
          <button type="button" className="locationBtn" onClick={handleGetLocation}>
            📍 Use My Location
          </button>
        </div>

        <textarea placeholder="Description (e.g. Cake color or design note)" required></textarea>
        <input type="text" placeholder="Weight (kg)" required />

        <input type="date" required />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default OrderForm;
