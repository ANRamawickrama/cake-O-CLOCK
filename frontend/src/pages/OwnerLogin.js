import React, { useState } from 'react';
import axios from 'axios';

const OwnerLogin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
  e.preventDefault();
  const { username, password } = credentials;

  const envUsername = process.env.REACT_APP_OWNER_USERNAME;
  const envPassword = process.env.REACT_APP_OWNER_PASSWORD;

  if (username === envUsername && password === envPassword) {
    setLoggedIn(true);
  } else {
    alert('Invalid credentials');
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

  return (
    <div style={{ padding: '20px' }}>
      {!loggedIn ? (
        <>
          <h2>Owner Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
            <br /><br />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
            <br /><br />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <>
          <h2>Upload Image</h2>
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
        </>
      )}
    </div>
  );
};

export default OwnerLogin;
