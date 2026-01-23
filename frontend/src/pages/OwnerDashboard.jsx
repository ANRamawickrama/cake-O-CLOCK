import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OwnerDashboard.css";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [ownerInfo, setOwnerInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Verify token and get owner info
    const verifyToken = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/owner/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwnerInfo(response.data.owner);
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    if (token) {
      verifyToken();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Owner Dashboard</h1>
          {ownerInfo && <p className="owner-email">Welcome, {ownerInfo.email}</p>}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-cards">
        <Link to="/update" className="dashboard-card upload">
          <div className="card-icon">📤</div>
          <h2>Upload New Cakes</h2>
          <p>Add new cakes to your menu</p>
        </Link>

        <Link to="/manage" className="dashboard-card manage">
          <div className="card-icon">⚙️</div>
          <h2>Update Cakes</h2>
          <p>Select type and edit prices, delete unused cakes</p>
        </Link>

        <Link to="/orders" className="dashboard-card orders">
          <div className="card-icon">📋</div>
          <h2>View Orders</h2>
          <p>See all customer orders</p>
        </Link>
      </div>
    </div>
  );
}
