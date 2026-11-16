const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');
const { persistDataUri } = require('../middleware/upload');

const ORDER_STATUSES = Order.ORDER_STATUSES;

// POST - Create a new order (public route for customers)
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      cakeId,
      cakeName,
      cakeImage,
      cakePrice,
      quantity,
      location,
      description,
      weight,
      deliveryDate,
    } = req.body;

    const missing = ['customerName', 'customerPhone', 'cakeName', 'location'].filter(
      (field) => !req.body[field] || String(req.body[field]).trim() === ''
    );

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Please provide: ${missing.join(', ').replace(/([A-Z])/g, ' $1').toLowerCase()}`,
      });
    }

    const numericQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
    const numericPrice = Number(cakePrice) > 0 ? Number(cakePrice) : 0;

    // Artwork is stored on disk, never inside the order document, so the
    // order list stays small enough to load quickly.
    let storedImage = cakeImage || null;
    if (typeof storedImage === 'string' && /^data:image\//i.test(storedImage)) {
      storedImage = persistDataUri(storedImage) || null;
    }

    const newOrder = new Order({
      customerName: customerName.trim(),
      customerEmail: (customerEmail || '').trim(),
      customerPhone: customerPhone.trim(),
      cakeId: cakeId || null,
      cakeName: cakeName.trim(),
      cakeImage: storedImage,
      cakePrice: numericPrice,
      quantity: numericQuantity,
      totalPrice: numericPrice * numericQuantity,
      location: location.trim(),
      description: (description || '').trim(),
      weight: (weight || '').trim(),
      deliveryDate: deliveryDate || null,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// GET - Dashboard stats (protected route for owner)
router.get('/stats', auth, async (req, res) => {
  try {
    // One round trip instead of three keeps the dashboard responsive even on
    // a high-latency link to Atlas.
    const [result] = await Order.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                pendingOrders: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', ['Pending', 'Confirmed', 'Baking', 'Ready']] },
                      1,
                      0,
                    ],
                  },
                },
                totalRevenue: {
                  $sum: {
                    $cond: [
                      { $ne: ['$status', 'Cancelled'] },
                      {
                        $cond: [
                          { $gt: [{ $ifNull: ['$totalPrice', 0] }, 0] },
                          '$totalPrice',
                          {
                            $multiply: [
                              { $ifNull: ['$cakePrice', 0] },
                              { $ifNull: ['$quantity', 1] },
                            ],
                          },
                        ],
                      },
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const totals = result?.totals?.[0] || {};
    const totalOrders = totals.totalOrders || 0;
    const pendingOrders = totals.pendingOrders || 0;

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders: totalOrders - pendingOrders,
      totalRevenue: totals.totalRevenue || 0,
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// GET - Get all orders (protected route for owner)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// PATCH - Update the status of an order (protected route for owner)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// GET - Get a single order (protected route for owner)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
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
