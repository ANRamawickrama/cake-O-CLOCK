const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  const { customerName, customerEmail, cakeName, quantity } = req.body;
  try {
    const order = new Order({ customerName, customerEmail, cakeName, quantity });
    await order.save();

res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};