import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/AnniversaryList.css";

function AnniversaryCake() {
  const [cakes, setCakes] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/cakes").then((res) => setCakes(res.data));
  }, []);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const anniversaryCakes = cakes.filter(
    (cake) => (cake.category || "").toLowerCase() === "anniversary"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please log in as owner to add cakes.");

    const payload = { ...form, category: "anniversary" };

    if (editingId) {
      const res = await axios.put(
        `http://localhost:5000/api/cakes/${editingId}`,
        payload,
        { headers: authHeaders }
      );
      setCakes(cakes.map((c) => (c._id === editingId ? res.data : c)));
      setEditingId(null);
    } else {
      const res = await axios.post("http://localhost:5000/api/cakes", payload, {
        headers: authHeaders,
      });
      setCakes([...cakes, res.data]);
    }

    setForm({ name: "", price: "", imageUrl: "" });
  };

  const startEdit = (cake) => {
    setEditingId(cake._id);
    setForm({ name: cake.name || "", price: cake.price || "", imageUrl: cake.imageUrl || "" });
  };

  const handleDelete = async (id) => {
    if (!token) return alert("Please log in as owner to delete cakes.");
    await axios.delete(`http://localhost:5000/api/cakes/${id}`, { headers: authHeaders });
    setCakes(cakes.filter((c) => c._id !== id));
  };

  return (
    <div className="anniversaryPage">
      <h1 className="anniversaryTitle">Choose your design in here...</h1>

      {token && (
        <div className="anniversary-admin-panel">
          <h2>{editingId ? "Edit Cake" : "Add New Cake"}</h2>
          <form className="anniversary-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Cake Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <div className="anniversary-actions">
              <button type="submit">{editingId ? "Save" : "Add New Cake"}</button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", price: "", imageUrl: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="anniversaryLists">
        {anniversaryCakes.map((cake) => (
          <div key={cake._id} className="cakeItem">
            {cake.imageUrl && <img src={cake.imageUrl} alt={cake.name} />}
            <h3>{cake.name}</h3>
            <p>Rs {cake.price}</p>
            {token ? (
              <div className="anniversary-row-actions">
                <button onClick={() => startEdit(cake)}>Edit</button>
                <button onClick={() => handleDelete(cake._id)}>Delete</button>
              </div>
            ) : (
              <Link to="/order">
                <button>Order</button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnniversaryCake;
