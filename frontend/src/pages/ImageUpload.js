import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Owner authentication state
  const [isOwner, setIsOwner] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const OWNER_PASSWORD = 'yourSecret123'; // Change this to your actual password or better auth

  // Handle login
  const handleLogin = () => {
    if (passwordInput === OWNER_PASSWORD) {
      setIsOwner(true);
    } else {
      alert('Wrong password!');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setUploadedUrl(res.data.imageUrl);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    // Show simple login form
    return (
      <div style={{ padding: '20px' }}>
        <h2>Owner Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin} style={{ marginLeft: '10px' }}>
          Login
        </button>
      </div>
    );
  }

  // Owner is authenticated, show upload form
  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Image (Owner only)</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Preview:</p>
          <img src={previewUrl} alt="preview" style={{ width: '200px' }} />
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="uploaded" style={{ width: '200px' }} />
          <p>
            <a href={uploadedUrl} target="_blank" rel="noreferrer">
              View on Cloudinary
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
