const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = /^\.(jpe?g|png|webp|gif|avif|svg)$/.test(ext) ? ext : ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only image files are allowed (jpg, png, webp, gif, avif, svg)"));
    }
    cb(null, true);
  },
});

/**
 * Converts an uploaded file into the public path that the static
 * `/uploads` route serves.
 */
const publicPathFor = (file) => `/uploads/${file.filename}`;

const MIME_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

/**
 * Persists a `data:` URI as a real file inside `backend/uploads` and returns
 * the public path for it.
 *
 * Keeping artwork on disk (instead of inside MongoDB) keeps documents small,
 * which is what makes the list endpoints fast.
 *
 * Any value that is not a data URI is returned untouched.
 */
const persistDataUri = (dataUri) => {
  if (typeof dataUri !== "string") return dataUri;

  const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(dataUri.trim());
  if (!match) return dataUri;

  const [, mime, payload] = match;
  const extension = MIME_EXTENSIONS[mime.toLowerCase()] || ".jpg";

  let buffer;
  try {
    buffer = Buffer.from(payload, "base64");
  } catch (error) {
    return null;
  }

  if (buffer.length === 0) return null;

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
};

module.exports = { upload, UPLOAD_DIR, publicPathFor, persistDataUri };