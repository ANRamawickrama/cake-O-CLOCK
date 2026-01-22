import { useState } from "react";
import axios from "axios";
import "../styles/UploadCakePage.css";

const CAKE_TYPES = [
  'Birthday Cake',
  'Anniversary Cake',
  'Cupcake',
  'Wedding Cake',
  'Wedding Structure',
  'Jar Cake'
];

export default function UploadCakePage() {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image selection and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!type || !price || !image) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setMessage("⚠️ Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const imageBase64 = reader.result;
          
          const cakeData = {
            type,
            price: Number(price),
            image: imageBase64
          };

          const token = localStorage.getItem("token");
          const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
          await axios.post(
            `${API_URL}/api/cakes/upload`,
            cakeData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              timeout: 10000
            }
          );

          // Reset form
          setType("");
          setPrice("");
          setImage(null);
          setImagePreview(null);
          setMessage("✅ Cake uploaded successfully!");
          // Clear success message after 2 seconds
          setTimeout(() => setMessage(""), 2000);
        } catch (err) {
          console.error("Upload error:", err);
          setMessage("❌ " + (err.response?.data?.message || "Upload failed. Try again!"));
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(image);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error processing image");
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Upload New Cakes</h2>
        <p className="subtitle">Add a new cake to the menu</p>
        
        <form className="upload-form" onSubmit={handleSubmit}>
          {/* Cake Type Dropdown */}
          <div className="form-group">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Cake Type</option>
              {CAKE_TYPES.map((cakeType) => (
                <option key={cakeType} value={cakeType}>
                  {cakeType}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              min="1"
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Upload Cake Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Uploading..." : " Upload Cake"}
          </button>
        </form>

        {/* Message */}
        {message && <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
}
