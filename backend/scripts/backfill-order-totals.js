/**
 * Backfills `totalPrice` on orders that were created before the field existed.
 *
 * Those rows only stored the unit price, so the dashboard used to report a
 * revenue of zero even though real orders had been paid for.
 *
 * Usage:  npm run backfill:totals
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('../models/Order');

(async () => {
  const uri = process.env.MONGO_URI || process.env.mongo;

  if (!uri) {
    console.error('MongoDB connection string missing. Set MONGO_URI in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const orders = await Order.find({
    $or: [{ totalPrice: { $lte: 0 } }, { totalPrice: { $exists: false } }],
  });
  let updated = 0;

  for (const order of orders) {
    const calculated = (order.cakePrice || 0) * (order.quantity || 1);
    if (calculated <= 0) continue;

    order.totalPrice = calculated;
    await order.save();
    updated += 1;
  }

  console.log(`Backfilled ${updated} order total(s).`);

  await mongoose.disconnect();
  console.log('Done.');
})().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
