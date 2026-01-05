import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/UploadCakePage.css";

export default function UploadCakePage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as owner to upload cakes");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !type || !price || !image) {
      setMessage("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/api/cakes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Cake uploaded successfully!");
      setName("");
      setType("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Try again!");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload New Cakes</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cake Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type (e.g., Chocolate, Vanilla)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (LKR)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Upload Cake</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
