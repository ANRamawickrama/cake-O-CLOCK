import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OrdersDashboard.css";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.delete(`${API_URL}/api/orders/${orderId}`, {
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
                <th>Cake Image</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Cake Name</th>
                <th>Price</th>
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
                  <td className="cake-image-cell">
                    {order.cakeImage ? (
                      <img 
                        src={order.cakeImage} 
                        alt={order.cakeName}
                        className="order-cake-image"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                    ) : null}
                    <span style={{ display: order.cakeImage ? 'none' : 'block' }}>No Image</span>
                  </td>
                  <td>{order.customerName}</td>
                  <td>
                    <a href={`tel:${order.customerPhone}`} className="phone-link">
                      📞 {order.customerPhone}
                    </a>
                  </td>
                  <td>{order.cakeName}</td>
                  <td>Rs {order.cakePrice || "N/A"}</td>
                  <td>{order.quantity || 1}</td>
                  <td>{order.weight || "N/A"}</td>
                  <td>{order.location}</td>
                  <td>{formatDate(order.deliveryDate)}</td>
                  <td>{order.description || "N/A"}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button 
                className="close-btn" 
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Cake Image Section */}
              <div className="modal-image-section">
                <h3>Ordered Cake</h3>
                {selectedOrder.cakeImage ? (
                  <img 
                    src={selectedOrder.cakeImage} 
                    alt={selectedOrder.cakeName}
                    className="modal-cake-image"
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </div>

              {/* Order Details Section */}
              <div className="modal-details-section">
                <div className="detail-row">
                  <span className="detail-label">Order Date:</span>
                  <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Cake Name:</span>
                  <span className="detail-value">{selectedOrder.cakeName}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Cake Price:</span>
                  <span className="detail-value">Rs {selectedOrder.cakePrice || "N/A"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Customer Name:</span>
                  <span className="detail-value">{selectedOrder.customerName}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    <a href={`tel:${selectedOrder.customerPhone}`}>
                      📞 {selectedOrder.customerPhone}
                    </a>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedOrder.customerEmail || "N/A"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{selectedOrder.quantity || 1}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Weight:</span>
                  <span className="detail-value">{selectedOrder.weight || "N/A"} kg</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Delivery Date:</span>
                  <span className="detail-value">{formatDate(selectedOrder.deliveryDate)}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Delivery Location:</span>
                  <span className="detail-value">{selectedOrder.location}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedOrder.description || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="delete-btn"
                onClick={() => {
                  handleDelete(selectedOrder._id);
                  setSelectedOrder(null);
                }}
              >
                🗑️ Delete Order
              </button>
              <button 
                className="close-modal-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
