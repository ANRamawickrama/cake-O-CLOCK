import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api, { apiErrorMessage } from "../services/api";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import "../styles/UploadCakePage.css";

const CAKE_TYPES = CAKE_CATEGORIES.map((category) => category.type);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export default function UploadCakePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessageType("error");
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setMessageType("error");
      setMessage("That image is larger than 8 MB. Please choose a smaller file.");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  };

  const resetForm = () => {
    setType("");
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!type || !price || !image) {
      setMessageType("error");
      setMessage("Please choose a type, a price and an image.");
      return;
    }

    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      setMessageType("error");
      setMessage("Please enter a price greater than zero.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("name", name.trim());
      formData.append("price", String(Number(price)));
      formData.append("description", description.trim());
      formData.append("image", image);

      await api.post("/api/cakes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 45000,
      });

      setMessageType("success");
      setMessage("Cake uploaded successfully!");
      resetForm();

      setTimeout(() => {
        navigate("/manage");
      }, 1200);
    } catch (err) {
      setMessageType("error");
      setMessage(apiErrorMessage(err, "Upload failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploadPage">
      <div className="container uploadInner">
        <div className="uploadPanel">
          <header className="uploadHeader">
            <p className="eyebrow">Menu management</p>
            <h1 className="uploadTitle">Upload a new cake</h1>
            <p className="uploadSub">
              Add a design to your menu. Customers see it on your category page
              straight away.
            </p>
          </header>

          {message && (
            <div
              className={`alert ${messageType === "success" ? "alert-success" : "alert-error"}`}
            >
              {messageType === "success" && (
                <CheckCircleIcon fontSize="small" />
              )}
              {message}
            </div>
          )}

          <form className="uploadForm" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="upload-type">Cake type</label>
              <select
                id="upload-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select a cake type</option>
                {CAKE_TYPES.map((cakeType) => (
                  <option key={cakeType} value={cakeType}>
                    {cakeType}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="upload-name">Design name</label>
              <input
                id="upload-name"
                type="text"
                placeholder="e.g. Rose Gold Celebration Tier"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loading}
                maxLength={120}
              />
            </div>

            <div className="field">
              <label htmlFor="upload-price">Price (Rs.)</label>
              <input
                id="upload-price"
                type="number"
                placeholder="5500"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                disabled={loading}
                min="1"
                step="0.01"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="upload-description">Description</label>
              <textarea
                id="upload-description"
                placeholder="Flavour, size, finishing details..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={loading}
                rows="3"
                maxLength={600}
              />
            </div>

            <div className="field">
              <label htmlFor="upload-image">Cake image</label>
              <label className="uploadDropzone" htmlFor="upload-image">
                {imagePreview ? (
                  <img src={imagePreview} alt="Selected cake" />
                ) : (
                  <>
                    <CloudUploadIcon fontSize="large" />
                    <span className="uploadDropzoneTitle">Choose an image</span>
                    <span className="uploadDropzoneHint">
                      JPG, PNG, WEBP or GIF · up to 8 MB
                    </span>
                  </>
                )}
              </label>
              <input
                ref={fileInputRef}
                id="upload-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="uploadFileInput"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Uploading..." : "Upload cake"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
