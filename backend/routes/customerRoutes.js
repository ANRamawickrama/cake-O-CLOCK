const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { customerAuth } = require('../middleware/customerAuth');

const router = express.Router();

const signToken = (customer) =>
  jwt.sign(
    { id: customer._id, role: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const publicCustomer = (customer) => ({
  id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone || '',
});

// REGISTER CUSTOMER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await Customer.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      phone: cleanPhone,
    });

    res.status(201).json({
      message: 'Account created successfully',
      token: signToken(customer),
      customer: publicCustomer(customer),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create account', error: err.message });
  }
});

// LOGIN CUSTOMER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    const customer = await Customer.findOne({ email: cleanEmail });

    if (!customer) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(String(password || ''), customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: signToken(customer),
      customer: publicCustomer(customer),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to sign in', error: err.message });
  }
});

// VERIFY CUSTOMER TOKEN
router.get('/verify', customerAuth, (req, res) => {
  res.json({ message: 'Token is valid', customer: publicCustomer(req.customer) });
});

// MY ORDERS
router.get('/orders', customerAuth, async (req, res) => {
  try {
    const customer = req.customer;

    // Orders placed while signed in carry the customer reference. Orders placed
    // before the account existed are matched on the same email address.
    const orders = await Order.find({
      $or: [
        { customerId: customer._id },
        { customerEmail: customer.email },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your orders', error: err.message });
  }
});

module.exports = router;
