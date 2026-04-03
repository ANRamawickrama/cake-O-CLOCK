# Cake Business Site

Full-stack cake ordering and management application with:
- A React frontend for customers and owner dashboard pages
- An Express + MongoDB backend API for cakes, orders, reviews, and owner authentication

## Project Structure

```text
cake-business-site/
  backend/   # Express API + MongoDB models/routes
  frontend/  # React app (Create React App)
```

## Tech Stack

- Frontend: React, React Router, Axios, MUI
- Backend: Node.js, Express, Mongoose, JWT, bcrypt
- Database: MongoDB

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (recommended)
- MongoDB Atlas URI or local MongoDB instance

## Environment Variables

Create a `.env` file in `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Notes:
- The server reads `MONGO_URI` (or fallback key `mongo`).
- `PORT` is optional; default is `5000`.

Optional frontend environment file `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

If not set, frontend code already falls back to `http://localhost:5000`.

## Installation

Install dependencies for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Start backend:

```bash
cd backend
npm start
```

Start frontend (in a second terminal):

```bash
cd frontend
npm start
```

Open the app at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Seed Sample Cake Data (Optional)

```bash
cd backend
node seedDatabase.js
```

This inserts sample cake records into MongoDB.

## Useful Scripts

### Backend

- `npm start` - Start Express server

### Frontend

- `npm start` - Run React dev server
- `npm run build` - Build production frontend
- `npm test` - Run tests

## API Overview

Base URL (local): `http://localhost:5000`

### Owner

- `POST /api/owner/register` - Register owner
- `POST /api/owner/login` - Login owner (returns JWT)
- `GET /api/owner/verify` - Verify owner token
- `GET /api/verify` - Generic token verification route

### Cakes

- `GET /api/cakes` - Get all cakes
- `GET /api/cakes/type/:type` - Get cakes by type
- `GET /api/cakes/owner/my-cakes` - Get owner cakes (auth)
- `POST /api/cakes/upload` - Add cake (auth)
- `PUT /api/cakes/:id` - Update cake (auth + owner check)
- `DELETE /api/cakes/:id` - Delete cake (auth + owner check)

### Orders

- `POST /api/orders` - Create order (public)
- `GET /api/orders` - List all orders (auth)
- `DELETE /api/orders/:id` - Delete order (auth)

### Reviews

- `POST /api/reviews` - Create review
- `GET /api/reviews` - List latest reviews
- `GET /api/reviews/cake/:cakeName` - Reviews for a cake
- `GET /api/reviews/rating/:cakeName` - Average rating for a cake

## Authentication

Protected backend routes expect a bearer token header:

```http
Authorization: Bearer <token>
```

Token is returned from `POST /api/owner/login` and signed with `JWT_SECRET`.

## Production Notes

- Build frontend with `npm run build` in `frontend/`.
- Deploy frontend and backend separately or behind a reverse proxy.
- Set `REACT_APP_API_URL` to your deployed backend URL.
- Ensure CORS policy in backend matches your frontend domain.
