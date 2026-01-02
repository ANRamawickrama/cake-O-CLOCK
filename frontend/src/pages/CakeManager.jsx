import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CakeManager() {
  const [cakes, setCakes] = useState([]);
  const [newCake, setNewCake] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:5000/api/cakes").then(res => setCakes(res.data));
  }, [token, navigate]);

  const handleAdd = async () => {
    if (!token) return navigate("/login");
    const res = await axios.post("http://localhost:5000/api/cakes", newCake, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCakes([...cakes, res.data]);
    setNewCake({ name: "", price: "" });
  };

  const startEdit = (cake) => {
    setEditingId(cake._id);
    setNewCake({ name: cake.name, price: cake.price });
  };

  const handleUpdate = async () => {
    if (!token || !editingId) return navigate("/login");
    const res = await axios.put(`http://localhost:5000/api/cakes/${editingId}`, newCake, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCakes(cakes.map(c => (c._id === editingId ? res.data : c)));
    setEditingId(null);
    setNewCake({ name: "", price: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewCake({ name: "", price: "" });
  };

  const handleDelete = async (id) => {
    if (!token) return navigate("/login");
    await axios.delete(`http://localhost:5000/api/cakes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCakes(cakes.filter(c => c._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cake Manager</h1>

      <div className="mb-4 flex gap-2">
        <input placeholder="Cake Name" className="border p-2"
          value={newCake.name}
          onChange={(e) => setNewCake({ ...newCake, name: e.target.value })} />
        <input placeholder="Price" className="border p-2" type="number" min="0"
          value={newCake.price}
          onChange={(e) => setNewCake({ ...newCake, price: e.target.value })} />
        {editingId ? (
          <>
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 rounded">Save</button>
            <button onClick={cancelEdit} className="bg-gray-300 px-4 rounded">Cancel</button>
          </>
        ) : (
          <button onClick={handleAdd} className="bg-pink-500 text-white px-4 rounded">Add</button>
        )}
      </div>

      <ul>
        {cakes.map(cake => (
          <li key={cake._id} className="flex justify-between border-b py-2">
            {cake.name} - Rs.{cake.price}
            <div className="flex gap-2">
              <button onClick={() => startEdit(cake)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(cake._id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
