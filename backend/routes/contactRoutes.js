const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/authMiddleware');

// POST - Public: send a custom order enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, occasion, guests, message } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Please tell us your name' });
    }

    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: 'Please tell us about your cake' });
    }

    if (!email && !phone) {
      return res.status(400).json({
        message: 'Please add an email address or phone number so we can reply',
      });
    }

    const enquiry = await ContactMessage.create({
      name: String(name).trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'Custom cake enquiry').trim(),
      occasion: (occasion || '').trim(),
      guests: (guests || '').trim(),
      message: String(message).trim(),
    });

    res.status(201).json({ message: 'Enquiry sent successfully', enquiry });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ message: 'Failed to send enquiry', error: error.message });
  }
});

// GET - Owner: list enquiries
router.get('/', auth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Failed to fetch enquiries' });
  }
});

// PATCH - Owner: mark an enquiry as read/replied
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['New', 'Read', 'Replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({ message: 'Enquiry updated', enquiry: message });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ message: 'Failed to update enquiry' });
  }
});

// DELETE - Owner: remove an enquiry
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ message: 'Failed to delete enquiry' });
  }
});

module.exports = router;
