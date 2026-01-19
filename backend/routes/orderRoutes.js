const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

// POST - Create a new order (public route for customers)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, cakeName, cakeImage, cakePrice, quantity, location, description, weight, deliveryDate } = req.body;

    const newOrder = new Order({
      customerName,
      customerEmail,
      customerPhone,
      cakeName,
      cakeImage,
      cakePrice,
      quantity,
      location,
      description,
      weight,
      deliveryDate
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// GET - Get all orders (protected route for owner)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// DELETE - Delete an order by ID (protected route for owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;
