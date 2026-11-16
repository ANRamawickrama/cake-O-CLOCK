# Cake'O Clock — Cake Business Site

Full-stack cake ordering and management application.

- **Frontend** — React (Create React App) customer storefront plus an owner dashboard
- **Backend** — Express + MongoDB API for cakes, orders, reviews, enquiries and owner authentication

## Project Structure

```text
cake-business-site/
  backend/
    config/         # cloudinary config
    middleware/     # JWT auth, multer image upload
    models/         # Cake, Order, Owner, Review, ContactMessage
    routes/         # Express routers
    uploads/        # uploaded cake images (git-ignored)
  frontend/
    src/
      component/    # Navbar, Footer, CakeCatalog, ReviewSection, ProtectedRoute
      helpers/      # site config, cake catalogue, api base url, image resolver
      hooks/        # useReveal (scroll animations)
      pages/        # storefront + dashboard pages
      services/     # shared axios instance
      styles/       # theme.css (design tokens) + per-page CSS
```

## Tech Stack

- Frontend: React 19, React Router 7, Axios, MUI Icons
- Backend: Node.js, Express 5, Mongoose 8, JWT, bcrypt, Multer
- Database: MongoDB (Atlas or local)
- Styling: Plain CSS with a shared token-based design system (`frontend/src/styles/theme.css`)

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (recommended)
- MongoDB Atlas URI or local MongoDB instance

## Environment Variables

Copy the example files and fill in your own values.

`backend/.env` (see `backend/.env.example`):

```env
MONGO_URI=mongodb+srv:<user>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
```

- The server reads `MONGO_URI` (fallback key `mongo`).
- `PORT` is optional; default is `5000`.
- `CLIENT_ORIGIN` is a comma separated allow-list for CORS. Leave it empty to allow any origin (local development).

`frontend/.env` (see `frontend/.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000
```

For local development `http://localhost:5000` is correct. For deployment, set it to your
real backend URL before building. All API calls go through the shared axios instance
in `frontend/src/services/api.js`, which also attaches the owner JWT and redirects to
the login page on a `401`.

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Backend:

```bash
cd backend
npm start
```

Frontend (second terminal):

```bash
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Owner Access

1. Open http://localhost:3000/login
2. Choose **Create account** and register the owner email + password
   (the account is created with `bcrypt` hashed password)
3. Sign in — the JWT is stored in `localStorage` and sent as
   `Authorization: Bearer <token>` on every protected request

## Useful Scripts

### Backend

- `npm start` — Start Express server
- `npm run seed:catalogue` — Load the 99 real cake designs into MongoDB. The script
  copies the photography from `frontend/src/assets` into `backend/uploads` and
  points each database row at the copied file, so every card on the site shows a
  real cake instead of a placeholder graphic. Re-running it replaces the
  previously seeded rows and leaves owner uploads alone.
- `npm run migrate:images` — Move any legacy `data:image/...;base64` artwork
  out of MongoDB and onto disk. Without this, list endpoints return megabytes
  of base64 and the owner dashboard takes several seconds to load.
- `npm run backfill:totals` — Fill in `totalPrice` for orders created before
  that field existed, so the revenue figure on the dashboard is correct.

### Frontend

- `npm start` — Run React dev server
- `npm run build` — Build production bundle
- `npm test` — Run tests

## API Overview

Base URL (local): `http://localhost:5000`

### Owner

- `POST /api/owner/register` — Register owner
- `POST /api/owner/login` — Login owner (returns JWT)
- `GET /api/owner/verify` — Verify owner token
- `GET /api/verify` — Generic token verification route

### Cakes

- `GET /api/cakes` — Get all cakes
- `GET /api/cakes/featured` — Get the designs highlighted on the home page
- `GET /api/cakes/type/:type` — Get cakes by type
- `GET /api/cakes/owner/my-cakes` — Get owner cakes (auth)
- `GET /api/cakes/:id` — Get a single cake
- `POST /api/cakes/upload` — Add cake (auth) — accepts `multipart/form-data` with an
  `image` file (stored on disk under `backend/uploads`) or a legacy base64 `image` string
- `PUT /api/cakes/:id` — Update cake (auth + owner check). Also accepts
  `{ "featured": true | false }` to control what appears on the home page.
- `DELETE /api/cakes/:id` — Delete cake (auth + owner check)

### Orders

- `POST /api/orders` — Create order (public)
- `GET /api/orders` — List all orders (auth)
- `GET /api/orders/stats` — Dashboard totals (auth)
- `GET /api/orders/:id` — Get a single order (auth)
- `PATCH /api/orders/:id/status` — Update status (auth) — `Pending`, `Confirmed`,
  `Baking`, `Ready`, `Completed`, `Cancelled`
- `DELETE /api/orders/:id` — Delete order (auth)

### Reviews

- `POST /api/reviews` — Create review
- `GET /api/reviews` — List latest reviews
- `GET /api/reviews/cake/:cakeName` — Reviews for a cake
- `GET /api/reviews/rating/:cakeName` — Average rating for a cake

### Contact

- `POST /api/contact` — Send a custom cake enquiry (public)
- `GET /api/contact` — List enquiries (auth)
- `PATCH /api/contact/:id/status` — Update enquiry status (auth)
- `DELETE /api/contact/:id` — Delete enquiry (auth)

## Authentication

Protected backend routes expect a bearer token header:

```http
Authorization: Bearer <token>
```

The token is returned from `POST /api/owner/login` and signed with `JWT_SECRET`.

## Images

Cake images are uploaded as files and served by the backend from `/uploads/<file>`.
The front-end resolves those paths with `frontend/src/helpers/imageUrl.js`, so a single
image reference works whether it points at the API host or at a bundled front-end asset.

Artwork is never stored inside MongoDB. Keeping images on disk keeps the documents
small, which is what makes the list endpoints fast, and lets the browser cache the
images for a week (`Cache-Control: immutable`).

If an image reference ever fails to load, `frontend/src/component/CakeImage.jsx`
swaps in a branded placeholder instead of showing a broken image.

To load the catalogue with real photography for the first time:

```bash
cd backend
npm run seed:catalogue
```

## Production Notes

- Build the front-end with `npm run build` in `frontend/`.
- Deploy the front-end and backend separately or behind a reverse proxy.
- Set `REACT_APP_API_URL` to your deployed backend URL before building, unless the
  front-end and API are served from the same origin.
- Set `CLIENT_ORIGIN` on the backend to your front-end domain so CORS stays restricted.
- `backend/.env` is git-ignored — use `backend/.env.example` as the template.
- Serve `backend/uploads` from persistent storage if you deploy to ephemeral hosting.
- Run `npm run migrate:images` and `npm run backfill:totals` once against an
  existing database before going live.

