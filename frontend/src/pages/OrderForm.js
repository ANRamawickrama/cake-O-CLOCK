import React, { useState } from "react";
import axios from "axios";
import BannerImage from "../assets/homee.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/OrderForm.css";

function OrderForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const cake = location.state?.cake;

  const [userLocation, setUserLocation] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  // 📋 Convert image to Base64 using Fetch
  const convertImageToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image`);
      }
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return ""; // Return empty string if conversion fails
    }
  };

  // 📋 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!fullName.trim() || !contactNumber.trim() || !userLocation.trim() || !weight.trim() || !deliveryDate || !cake) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Convert cake image to base64 for storage
      let cakeImageBase64 = "";
      if (cake.image) {
        console.log("Converting image to base64...");
        cakeImageBase64 = await convertImageToBase64(cake.image);
        console.log("Image conversion completed");
      }

      const orderData = {
        customerName: fullName,
        customerEmail: email || "not provided",
        customerPhone: contactNumber,
        cakeName: cake.name,
        cakeImage: cakeImageBase64,
        cakePrice: cake.price,
        quantity: 1,
        location: userLocation,
        description,
        weight,
        deliveryDate
      };

      console.log("Placing order with cake:", cake.name);
      const response = await axios.post("http://localhost:5000/api/orders", orderData, {
        timeout: 10000
      });
      
      if (response.status === 201) {
        alert("✅ Order placed successfully! The owner will contact you soon.");
        navigate("/");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      let errorMessage = "Failed to place order. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === "timeout of 10000ms exceeded") {
        errorMessage = "Request took too long. Please check your internet connection and try again.";
      } else if (err.message.includes("Network")) {
        errorMessage = "Network error. Please check if the server is running and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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

      <form className="orderForm" onSubmit={handleSubmit}>
        <h1 className="orderTitle">Cake Order Form</h1>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required 
        />
        <input 
          type="email" 
          placeholder="Email (Optional)" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Contact Number" 
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required 
        />

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

        <textarea 
          placeholder="Description (e.g. Cake color or design note)" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input 
          type="text" 
          placeholder="Weight (kg)" 
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required 
        />

        <input 
          type="date" 
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default OrderForm;
