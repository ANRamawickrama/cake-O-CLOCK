import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CakeManagementPage.css";

export default function CakeManagementPage() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ type: "", price: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  // Fetch all cakes from menu (no auth required for viewing)
  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/cakes`);
      setCakes(response.data);
      setFilteredCakes(response.data);
    } catch (err) {
      setError("Failed to load cakes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter cakes based on search and type
  useEffect(() => {
    let filtered = cakes;

    if (filterType !== "All") {
      filtered = filtered.filter((cake) => cake.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (cake) =>
          cake.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cake.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCakes(filtered);
  }, [searchTerm, filterType, cakes]);

  const startEdit = (cake) => {
    setEditingId(cake._id);
    setEditData({
      type: cake.type,
      price: cake.price,
      description: cake.description || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ type: "", price: "", description: "" });
    setError("");
  };

  const handleUpdate = async (id) => {
    try {
      // Validation
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
      // Reload cakes if unauthorized
      if (err.response?.status === 403) {
        fetchCakes();
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cake? This action cannot be undone.")) {
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
      // Reload cakes if unauthorized (cake was added by different owner)
      if (err.response?.status === 403) {
        fetchCakes();
      }
    }
  };

  const cakeTypes = ["All", "Birthday Cake", "Anniversary Cake", "Cupcake", "Wedding Cake", "Wedding Structure", "Jar Cake"];

  return (
    <div className="cake-management-page">
      <div className="management-header">
        <h1>🍰 All Cakes Menu</h1>
        <p>View all cakes. Update prices and delete as needed</p>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Search and Filter */}
      <div className="management-controls">
        <input
          type="text"
          placeholder="Search cakes by type or description..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {cakeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <span className="results-count">
          {filteredCakes.length} cake{filteredCakes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cakes List */}
      {loading ? (
        <div className="loading">Loading cakes from menu...</div>
      ) : filteredCakes.length === 0 ? (
        <div className="no-cakes">
          <p>No cakes found in menu. Start by uploading a cake!</p>
        </div>
      ) : (
        <div className="cakes-grid">
          {filteredCakes.map((cake) => (
            <div key={cake._id} className="cake-card">
              {/* Image */}
              <div className="cake-image-container">
                <img src={cake.image} alt={cake.type} className="cake-image" />
              </div>

              {/* Content */}
              <div className="cake-content">
                {editingId === cake._id ? (
                  // Edit Mode
                  <div className="edit-form">
                    <select
                      className="edit-input"
                      value={editData.type}
                      onChange={(e) =>
                        setEditData({ ...editData, type: e.target.value })
                      }
                    >
                      {cakeTypes.slice(1).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <div className="price-input-group">
                      <span className="currency">Rs.</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="edit-input price"
                        placeholder="Price"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: parseFloat(e.target.value) || "" })
                        }
                      />
                    </div>

                    <textarea
                      className="edit-input description"
                      placeholder="Description (optional)"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      rows="2"
                    />

                    <div className="edit-actions">
                      <button
                        className="btn btn-save"
                        onClick={() => handleUpdate(cake._id)}
                      >
                        ✓ Save
                      </button>
                      <button className="btn btn-cancel" onClick={cancelEdit}>
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <h3 className="cake-type">{cake.type}</h3>
                    <p className="cake-price">Rs. {cake.price.toFixed(2)}</p>
                    {cake.description && (
                      <p className="cake-description">{cake.description}</p>
                    )}
                    <p className="cake-date">
                      Updated: {new Date(cake.updatedAt || cake.createdAt).toLocaleDateString()}
                    </p>

                    <div className="cake-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => {
                          if (!token) {
                            alert("Please login to edit cakes");
                            navigate("/login");
                            return;
                          }
                          startEdit(cake);
                        }}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => {
                          if (!token) {
                            alert("Please login to delete cakes");
                            navigate("/login");
                            return;
                          }
                          handleDelete(cake._id);
                        }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
