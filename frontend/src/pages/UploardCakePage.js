import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api, { apiErrorMessage } from "../services/api";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import "../styles/UploadCakePage.css";

const CAKE_TYPES = CAKE_CATEGORIES.map((category) => category.type);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES = 50;
const WEDDING_STRUCTURE_TYPE = "Wedding Structure";

export default function UploadCakePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    return () => imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [imagePreviews]);

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files || []);
    if (!selectedImages.length) return;

    if (selectedImages.length > MAX_IMAGES) {
      setMessageType("error");
      setMessage(`Please choose no more than ${MAX_IMAGES} images at a time.`);
      return;
    }

    const invalidImage = selectedImages.find((file) => !file.type.startsWith("image/"));
    if (invalidImage) {
      setMessageType("error");
      setMessage("Please choose image files only.");
      return;
    }

    const oversizedImage = selectedImages.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversizedImage) {
      setMessageType("error");
      setMessage("Each image must be smaller than 8 MB.");
      return;
    }

    setImages(selectedImages);
    setImagePreviews(selectedImages.map((file) => URL.createObjectURL(file)));
    setMessage("");
  };

  const resetForm = () => {
    setType("");
    setPrice("");
    setWeightKg("");
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!type || !price || !images.length) {
      setMessageType("error");
      setMessage("Please choose a type, a price and at least one image.");
      return;
    }

    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      setMessageType("error");
      setMessage("Please enter a price greater than zero.");
      return;
    }

    if (type !== WEDDING_STRUCTURE_TYPE && weightKg !== "" && (Number.isNaN(Number(weightKg)) || Number(weightKg) < 0)) {
      setMessageType("error");
      setMessage("Please enter a weight of 0 kg or more.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("price", String(Number(price)));
      if (type !== WEDDING_STRUCTURE_TYPE) {
        formData.append("weightKg", String(Number(weightKg) || 0));
      }
      images.forEach((image) => formData.append("images", image));

      await api.post("/api/cakes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      setMessageType("success");
      setMessage(`${images.length} cake${images.length === 1 ? "" : "s"} uploaded successfully!`);
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

            {type !== WEDDING_STRUCTURE_TYPE && (
              <div className="field">
                <label htmlFor="upload-weight">Weight (kg)</label>
                <input
                  id="upload-weight"
                  type="number"
                  placeholder="2"
                  value={weightKg}
                  onChange={(event) => setWeightKg(event.target.value)}
                  disabled={loading}
                  min="0"
                  step="0.25"
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="upload-image">Cake images</label>
              <label className="uploadDropzone" htmlFor="upload-image">
                {imagePreviews.length ? (
                  <div className="uploadPreviewGrid">
                    {imagePreviews.map((preview, index) => (
                      <img key={preview} src={preview} alt={`Selected cake ${index + 1}`} />
                    ))}
                  </div>
                ) : (
                  <>
                    <CloudUploadIcon fontSize="large" />
                    <span className="uploadDropzoneTitle">Choose one or more images</span>
                    <span className="uploadDropzoneHint">
                      JPG, PNG, WEBP or GIF · up to 8 MB each
                    </span>
                  </>
                )}
              </label>
              <input
                ref={fileInputRef}
                id="upload-image"
                type="file"
                accept="image/*"
                multiple
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
