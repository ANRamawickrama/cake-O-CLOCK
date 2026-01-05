import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/OrdersDashboard.css";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view orders");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please login again.");
      setLoading(false);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter((order) => order._id !== orderId));
      alert("Order deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="orders-dashboard">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-dashboard">
      <h2>Customer Orders</h2>

      {error && <p className="error-message">{error}</p>}

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Cake Name</th>
                <th>Quantity</th>
                <th>Weight</th>
                <th>Location</th>
                <th>Delivery Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <a href={`tel:${order.customerPhone}`} className="phone-link">
                      📞 {order.customerPhone}
                    </a>
                  </td>
                  <td>{order.cakeName}</td>
                  <td>{order.quantity || 1}</td>
                  <td>{order.weight || "N/A"}</td>
                  <td>{order.location}</td>
                  <td>{formatDate(order.deliveryDate)}</td>
                  <td>{order.description || "N/A"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
