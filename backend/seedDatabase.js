/**
 * Kept for backwards compatibility - the real seeding work now lives in
 * `scripts/seed-catalogue.js`.
 *
 * Run it with:
 *   npm run seed:catalogue
 *
 * It copies the actual cake photography from `frontend/src/assets` into
 * `backend/uploads` and loads the catalogue into MongoDB, so every card on
 * the site shows a real cake instead of a placeholder graphic.
 */
require('./scripts/seed-catalogue');
