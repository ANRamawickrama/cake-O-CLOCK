import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CakeTypeSelectorPage.css";

const CAKE_TYPES = [
  "Birthday Cake",
  "Anniversary Cake",
  "Cupcake",
  "Wedding Cake",
  "Wedding Structure",
  "Jar Cake",
];

export default function CakeTypeSelectorPage() {
  const [selectedType, setSelectedType] = useState("Birthday Cake");
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ price: "", description: "" });
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  const fetchCakesByType = useCallback(async (type) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/api/cakes/type/${type}`);
      setCakes(response.data);
    } catch (err) {
      setError("Failed to load cakes");
      console.error(err);
      setCakes([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Fetch cakes when type changes
  useEffect(() => {
    if (selectedType) {
      fetchCakesByType(selectedType);
    }
  }, [selectedType, fetchCakesByType]);

  const startEdit = (cake) => {
    setEditingId(cake._id);
    setEditData({
      price: cake.price,
      description: cake.description || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ price: "", description: "" });
    setError("");
  };

  const handleUpdate = async (id) => {
    try {
      if (!editData.price || editData.price <= 0) {
        setError("Price must be greater than 0");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/cakes/${id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCakes(cakes.map((c) => (c._id === id ? response.data.cake : c)));
      setEditingId(null);
      setSuccess("Cake updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update cake";
      setError(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cake?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/cakes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCakes(cakes.filter((c) => c._id !== id));
      setSuccess("Cake deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete cake";
      setError(errorMsg);
    }
  };

  return (
    <div className="cake-type-selector-page">
      {/* Header */}
      <div className="selector-header">
        <h1>🍰 Update Cakes Menu</h1>
        <p>Select a cake type to manage and update prices</p>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Type Selector */}
      <div className="type-selector-container">
        <label htmlFor="cakeType">Select Cake Type:</label>
        <select
          id="cakeType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="type-selector"
        >
          {CAKE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Cakes Display */}
      {loading ? (
        <div className="loading">Loading {selectedType}s...</div>
      ) : cakes.length === 0 ? (
        <div className="no-cakes">
          <p>No {selectedType}s found</p>
        </div>
      ) : (
        <div className="cakes-container">
          <div className="cakes-grid">
            {cakes.map((cake) => (
              <div key={cake._id} className="cake-item">
                {/* Image */}
                <div className="cake-image-wrapper">
                  <img src={cake.image} alt={cake.type} className="cake-img" />
                </div>

                {/* Content */}
                {editingId === cake._id ? (
                  // Edit Mode
                  <div className="cake-edit-form">
                    <div className="price-group">
                      <label>Price (Rs.)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: parseFloat(e.target.value) || "" })
                        }
                        className="price-input"
                      />
                    </div>

                    <div className="desc-group">
                      <label>Description</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                        className="desc-input"
                        rows="2"
                      />
                    </div>

                    <div className="edit-buttons">
                      <button
                        className="btn-save"
                        onClick={() => handleUpdate(cake._id)}
                      >
                        ✓ Save
                      </button>
                      <button className="btn-cancel" onClick={cancelEdit}>
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="cake-info">
                    <h3 className="cake-name">{cake.type}</h3>
                    <p className="cake-price">Rs. {cake.price.toFixed(2)}</p>
                    {cake.description && (
                      <p className="cake-desc">{cake.description}</p>
                    )}

                    <div className="cake-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => startEdit(cake)}
                      >
                        ✎ Edit Price
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cake._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
