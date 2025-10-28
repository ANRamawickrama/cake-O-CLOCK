import { useEffect, useState } from "react";
import axios from "axios";

export default function CakeManager() {
  const [cakes, setCakes] = useState([]);
  const [newCake, setNewCake] = useState({ name: "", price: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/cakes").then(res => setCakes(res.data));
  }, []);

  const handleAdd = async () => {
    const res = await axios.post("http://localhost:5000/api/cakes", newCake, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCakes([...cakes, res.data]);
  };

  const handleDelete = async (id) => {
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
          onChange={(e) => setNewCake({ ...newCake, name: e.target.value })} />
        <input placeholder="Price" className="border p-2"
          onChange={(e) => setNewCake({ ...newCake, price: e.target.value })} />
        <button onClick={handleAdd} className="bg-pink-500 text-white px-4 rounded">Add</button>
      </div>

      <ul>
        {cakes.map(cake => (
          <li key={cake._id} className="flex justify-between border-b py-2">
            {cake.name} - Rs.{cake.price}
            <button onClick={() => handleDelete(cake._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
