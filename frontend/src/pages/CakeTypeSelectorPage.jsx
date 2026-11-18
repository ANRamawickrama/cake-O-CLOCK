import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import api, { apiErrorMessage } from "../services/api";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import { formatPrice } from "../helpers/site";
import CakeImage from "../component/CakeImage";
import "../styles/CakeTypeSelectorPage.css";

const CAKE_TYPES = CAKE_CATEGORIES.map((category) => category.type);
const WEDDING_STRUCTURE_TYPE = "Wedding Structure";

export default function CakeTypeSelectorPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ price: "", weightKg: "" });
  const [savingId, setSavingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchMyCakes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/cakes/owner/my-cakes");
      setCakes(data || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to load your cakes."));
      setCakes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCakes();
  }, [fetchMyCakes]);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const visibleCakes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return cakes.filter((cake) => {
      const matchesType = selectedType === "All" || cake.type === selectedType;
      const matchesSearch =
        !term ||
        cake.type.toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [cakes, selectedType, search]);

  const startEdit = (cake) => {
    setEditingId(cake._id);
    setEditData({
      price: cake.price,
      weightKg: cake.weightKg || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ price: "", weightKg: "" });
  };

  const handleUpdate = async (id) => {
    if (!editData.price || Number(editData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setSavingId(id);
    setError("");
    try {
      const cake = cakes.find((item) => item._id === id);
      const update = cake?.type === WEDDING_STRUCTURE_TYPE
        ? { price: Number(editData.price) }
        : {
            price: Number(editData.price),
            weightKg: Number(editData.weightKg) || 0,
          };
      const { data } = await api.put(`/api/cakes/${id}`, update);
      setCakes((current) =>
        current.map((cake) => (cake._id === id ? data.cake : cake))
      );
      cancelEdit();
      showSuccess("Cake updated successfully!");
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to update cake"));
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleFeatured = async (cake) => {
    setSavingId(cake._id);
    setError("");

    try {
      const { data } = await api.put(`/api/cakes/${cake._id}`, {
        featured: !cake.featured,
      });
      setCakes((current) =>
        current.map((item) => (item._id === cake._id ? data.cake : item))
      );
      showSuccess(
        data.cake.featured
          ? "Added to the home page favourites!"
          : "Removed from the home page favourites."
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to update cake"));
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {    if (!window.confirm("Delete this cake? This cannot be undone.")) return;

    try {
      await api.delete(`/api/cakes/${id}`);
      setCakes((current) => current.filter((cake) => cake._id !== id));
      showSuccess("Cake deleted successfully!");
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to delete cake"));
    }
  };

  const totalValue = visibleCakes.reduce((sum, cake) => sum + cake.price, 0);

  return (
    <div className="managePage">
      <div className="container">
        <header className="manageHeader">
          <div>
            <p className="eyebrow">Menu management</p>
            <h1 className="manageTitle">Your cakes</h1>
            <p className="manageSub">
              Update prices and weights, or remove cakes that are no longer on the menu.
            </p>
          </div>
          <Link to="/update" className="btn btn-primary">
            Upload new cake
            <ArrowForwardIcon fontSize="small" />
          </Link>
        </header>

        {error && <div className="alert alert-error manageAlert">{error}</div>}
        {success && <div className="alert alert-success manageAlert">{success}</div>}

        <div className="manageStats">
          <div className="manageStat">
            <strong>{cakes.length}</strong>
            <span>Cakes on your menu</span>
          </div>
          <div className="manageStat">
            <strong>{visibleCakes.length}</strong>
            <span>Showing right now</span>
          </div>
          <div className="manageStat">
            <strong>{formatPrice(totalValue)}</strong>
            <span>Combined menu value</span>
          </div>
        </div>

        <div className="manageToolbar">
          <div className="manageTypeTabs" role="tablist" aria-label="Cake type">
            {["All", ...CAKE_TYPES].map((type) => {
              const count =
                type === "All"
                  ? cakes.length
                  : cakes.filter((cake) => cake.type === type).length;

              return (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={selectedType === type}
                  className={`manageTypeTab ${selectedType === type ? "isActive" : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                  <span className="manageTypeCount">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="manageSearch">
            <SearchIcon fontSize="small" />
            <label className="srOnly" htmlFor="manage-search">
              Search your cakes
            </label>
            <input
              id="manage-search"
              type="search"
              placeholder="Search your cakes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="manageGrid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="manageSkeleton" />
            ))}
          </div>
        ) : visibleCakes.length === 0 ? (
          <div className="manageEmpty">
            <h2>Nothing here yet</h2>
            <p>
              {cakes.length === 0
                ? "You haven't uploaded any cakes yet. Add your first design to get started."
                : "No cakes match this filter. Try a different type or search term."}
            </p>
            <Link to="/update" className="btn btn-primary">
              Upload a cake
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        ) : (
          <div className="manageGrid">
            {visibleCakes.map((cake) => (
              <article key={cake._id} className="manageCard">
                <div className="manageCardMedia">
                  <CakeImage src={cake.image} alt={cake.type} />
                  <span className="manageCardType">{cake.type}</span>
                  {cake.featured && (
                    <span className="manageCardFeatured">
                      <StarIcon fontSize="small" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="manageCardBody">
                  {editingId === cake._id ? (
                    <div className="manageEditForm">
                      <div className="field">
                        <label htmlFor={`price-${cake._id}`}>Price (Rs.)</label>
                        <input
                          id={`price-${cake._id}`}
                          type="number"
                          min="1"
                          step="0.01"
                          value={editData.price}
                          onChange={(event) =>
                            setEditData({
                              ...editData,
                              price: event.target.value,
                            })
                          }
                        />
                      </div>

                      {cake.type !== WEDDING_STRUCTURE_TYPE && (
                        <div className="field">
                          <label htmlFor={`weight-${cake._id}`}>Weight (kg)</label>
                          <input
                            id={`weight-${cake._id}`}
                            type="number"
                            min="0"
                            step="0.25"
                            placeholder="2"
                            value={editData.weightKg}
                            onChange={(event) =>
                              setEditData({
                                ...editData,
                                weightKg: event.target.value,
                              })
                            }
                          />
                        </div>
                      )}

                      <div className="manageEditActions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdate(cake._id)}
                          disabled={savingId === cake._id}
                        >
                          {savingId === cake._id ? "Saving..." : "Save changes"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="manageCardTitle">
                        {cake.type}
                      </h3>
                      <p className="manageCardPrice">{formatPrice(cake.price)}</p>
                      {cake.type !== WEDDING_STRUCTURE_TYPE && cake.weightKg > 0 && (
                        <p className="manageCardWeight">{cake.weightKg} kg</p>
                      )}

                      <div className="manageCardActions">
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            cake.featured ? "btn-primary" : "btn-outline"
                          }`}
                          onClick={() => handleToggleFeatured(cake)}
                          disabled={savingId === cake._id}
                        >
                          <StarIcon fontSize="small" />
                          {cake.featured ? "Featured" : "Feature"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => startEdit(cake)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(cake._id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
