import { useNavigate, Link } from "react-router-dom";
import "../styles/OwnerDashboard.css";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-cards">
        <Link to="/update" className="dashboard-card">
          <div className="card-icon">🍰</div>
          <h2>Upload Cakes</h2>
          <p>Add new cakes to your menu</p>
        </Link>

        <Link to="/orders" className="dashboard-card">
          <div className="card-icon">📋</div>
          <h2>View Orders</h2>
          <p>See all customer orders</p>
        </Link>

        <Link to="/manage" className="dashboard-card">
          <div className="card-icon">⚙️</div>
          <h2>Manage Cakes</h2>
          <p>Edit or delete existing cakes</p>
        </Link>
      </div>
    </div>
  );
}
