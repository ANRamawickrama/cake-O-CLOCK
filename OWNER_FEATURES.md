# Cake Business Site - Owner Features

## Features Implemented

### For Owners (After Login):

1. **Owner Dashboard** (`/dashboard`)
   - Central hub for owner operations
   - Quick access to upload cakes, view orders, and manage cakes
   - Logout functionality

2. **Upload Cakes** (`/update`)
   - Add new cakes to the system
   - Upload cake images
   - Set cake name, type, and price
   - Protected route (requires login)

3. **View Customer Orders** (`/orders`)
   - See all customer orders in a table
   - View order details: customer info, cake name, delivery date, location, etc.
   - Delete orders functionality
   - Protected route (requires login)

4. **Manage Cakes** (`/manage`)
   - Edit or delete existing cakes

### For Customers:

1. **Order Form** (`/order`)
   - Place cake orders
   - GPS location detection for delivery
   - Order details saved to database
   - Email confirmation

## How to Use

### Starting the Application:

1. **Backend:**
   ```bash
   cd backend
   npm install
   node server.js
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Owner Login Flow:

1. Go to `/login`
2. Enter owner credentials (email and password)
3. After successful login, you'll be redirected to `/dashboard`
4. From the dashboard, you can:
   - Click "Upload Cakes" to add new cakes
   - Click "View Orders" to see customer orders
   - Click "Manage Cakes" to edit/delete cakes

### Customer Order Flow:

1. Browse cakes on the menu
2. Click "Order" on a cake
3. Fill in the order form
4. Submit order (saved to database)
5. Owner can view this order in the Orders Dashboard

## API Endpoints

### Orders:
- `POST /api/orders` - Create a new order (public)
- `GET /api/orders` - Get all orders (protected, requires token)
- `DELETE /api/orders/:id` - Delete an order (protected, requires token)

### Cakes:
- `POST /api/cakes/upload` - Upload a new cake
- `GET /api/cakes` - Get all cakes
- Other cake management endpoints

### Owner:
- `POST /api/owner/login` - Owner login
- Returns JWT token for authentication

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is stored in localStorage after login and automatically included in protected API requests.
