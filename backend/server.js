// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const ownerRoutes = require('./routes/ownerRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cakeRoutes = require('./routes/cakeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { copyCatalogueAssets } = require('./middleware/upload');

const app = express();

// ===== Middleware (MUST BE BEFORE ROUTES) =====
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/non-browser callers and any configured front-end.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// ===== Static Files =====
// Uploaded artwork never changes under the same file name, so it can be
// cached aggressively by the browser.
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    immutable: true,
    fallthrough: true,
  })
);

// Permanent fallback for catalogue artwork while uploads are hosted on an
// ephemeral Render filesystem. Existing catalogue rows keep their `/uploads`
// URLs and load from the public repository assets if a file is missing.
app.get('/uploads/:filename', (req, res, next) => {
  const localFile = path.join(__dirname, 'uploads', path.basename(req.params.filename));
  if (fs.existsSync(localFile)) return next();

  const filename = req.params.filename;
  let assetPath = null;

  const numbered = /^catalogue-(birthday|cupcake|anniversary|structure)-(\d+)\.(jpg|jpeg|png|webp)$/i.exec(filename);
  if (numbered) {
    const folder = numbered[1] === 'structure' ? 'structures' : numbered[1];
    assetPath = `frontend/src/assets/${folder}/${numbered[2]}.${numbered[3].toLower}`;
  } else if (/^catalogue-jar\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    assetPath = 'frontend/src/assets/jar.jpg';
  } else if (/^catalogue-wedding\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    assetPath = 'frontend/src/assets/weddingcake.jpg';
  }

  if (!assetPath) return next();

  res.redirect(
    302,
    `https://raw.githubusercontent.com/ANRamawickrama/cake-O-CLOCK/main/${assetPath}`
  );
});

// ===== Routes =====
app.use('/api/owner', ownerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/cakes', cakeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

// ===== Verify Token Route =====
const auth = require('./middleware/authMiddleware');
app.get('/api/verify', auth, (req, res) => {
  res.json({ message: 'Token is valid', userId: req.user.id });
});

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

// ===== 404 for unknown API routes =====
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ===== Central error handler =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Image is too large (max 8 MB)' });
  }

  if (err?.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server',
  });
});

// ===== MongoDB Connection =====
const MONGO_URI = process.env.MONGO_URI || process.env.mongo;

mongoose
  .connect(MONGO_URI, {
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    const copied = copyCatalogueAssets();
    if (copied > 0) {
      console.log(`✅ Restored ${copied} catalogue image(s)`);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
