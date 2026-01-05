import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BannerImage from "../assets/homee.jpg";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = "tel:+947710961790";
  };

  return (
    <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
      <Link to="/login">
      <button className="loginBtn" onClick={() => navigate("/upload")}>
        Login
      </button>
      </Link>

      <button className="callBtn" onClick={handleCall}>
        📞 CALL NOW
      </button>

      {/* Centered content */}
      <div className="headerContainer">
        <h1>CAKE'O clock</h1>
        <Link to="/menu">
          <button className="orderBtn">
            ORDER NOW
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;