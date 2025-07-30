import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image); // 'image' must match `parser.single('image')`

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setUrl(res.data.imageUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {url && <img src={url} alt="Uploaded" width="300" />}
    </div>
  );
};

export default ImageUpload;
