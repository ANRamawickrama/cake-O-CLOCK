/**
 * Migrates legacy base64 artwork out of MongoDB and onto disk.
 *
 * Older versions of this project stored cake images and order snapshots as
 * `data:image/...;base64,...` strings inside the documents themselves. That
 * made every list endpoint megabytes wide, which is why the owner dashboard
 * used to take several seconds to load.
 *
 * This script writes each embedded image into `backend/uploads` and rewrites
 * the document to keep only the short `/uploads/<file>` path.
 *
 * Usage:  npm run migrate:images
 * It is safe to run more than once - documents that already point at a file
 * are left untouched.
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Cake = require('../models/cake');
const Order = require('../models/Order');
const { persistDataUri } = require('../middleware/upload');

const isDataUri = (value) => typeof value === 'string' && /^data:image\//i.test(value);

const migrateCakes = async () => {
  const cakes = await Cake.find({ image: /^data:image\//i });
  let migrated = 0;

  for (const cake of cakes) {
    const publicPath = persistDataUri(cake.image);
    if (!publicPath) {
      console.warn(`  ! skipped ${cake._id}: image could not be decoded`);
      continue;
    }
    // `updateOne` is used on purpose: legacy rows predate the `ownerId`
    // requirement and would fail document validation on `save()`.
    await Cake.updateOne({ _id: cake._id }, { $set: { image: publicPath } });
    migrated += 1;
  }

  return migrated;
};

const migrateOrders = async () => {
  const orders = await Order.find({ cakeImage: /^data:image\//i });
  let migrated = 0;

  for (const order of orders) {
    const publicPath = persistDataUri(order.cakeImage);
    if (!publicPath) {
      console.warn(`  ! skipped ${order._id}: image could not be decoded`);
      continue;
    }
    order.cakeImage = publicPath;
    await order.save();
    migrated += 1;
  }

  return migrated;
};

/**
 * Legacy catalogue rows were created before owners existed, so they are not
 * linked to any account and are invisible on the owner dashboard. Attach
 * them to the bakery account so the owner can manage them.
 */
const attachOrphanedCakes = async () => {
  const owners = await mongoose.connection.db
    .collection('owners')
    .find({})
    .sort({ _id: 1 })
    .toArray();

  const bakeryOwner = owners.find((owner) => !/test|example/i.test(owner.email || ''));
  if (!bakeryOwner) return 0;

  const result = await Cake.updateMany(
    { $or: [{ ownerId: { $exists: false } }, { ownerId: null }] },
    { $set: { ownerId: bakeryOwner._id } }
  );

  return result.modifiedCount;
};

(async () => {
  const uri = process.env.MONGO_URI || process.env.mongo;

  if (!uri) {
    console.error('MongoDB connection string missing. Set MONGO_URI in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const cakeCount = await migrateCakes();
  const orderCount = await migrateOrders();
  const attached = await attachOrphanedCakes();

  console.log(`Migrated ${cakeCount} cake image(s).`);
  console.log(`Migrated ${orderCount} order image(s).`);
  console.log(`Attached ${attached} orphaned cake(s) to the bakery account.`);

  await mongoose.disconnect();
  console.log('Done.');
})().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
