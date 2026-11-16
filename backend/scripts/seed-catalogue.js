/**
 * Seeds the bakery catalogue with the real cake photography that ships with
 * the front-end.
 *
 * Every artwork file is copied into `backend/uploads` and the database keeps
 * only the short `/uploads/<file>` path, so the API stays small and fast.
 *
 * Usage:  npm run seed:catalogue
 *
 * Running it again is safe - previously seeded catalogue rows are replaced,
 * while cakes uploaded by the owner are left untouched.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Cake = require('../models/cake');
const { UPLOAD_DIR } = require('../middleware/upload');

const FRONTEND_ASSETS = path.join(__dirname, '..', '..', 'frontend', 'src', 'assets');

const BIRTHDAY_PRICES = [
  2500, 3500, 4000, 4500, ...Array(36).fill(5500),
];
const CUPCAKE_PRICES = [
  2500, 3500, 4000, 4500, ...Array(12).fill(5500),
];
const ANNIVERSARY_PRICES = [
  4500, 4800, 5000, 5200, 5500, 5800, 6000, 6200, 6500, 6800, 7000, 7200, 7400, 7500, 7800, 8000,
];

const BIRTHDAY_NAMES = [
  'Chocolate Truffle Celebration', 'Vanilla Bean Classic', 'Strawberry & Cream Dream',
  'Red Velvet Romance', 'Caramel Drizzle Delight', 'Lemon Zest Fresh',
  'Coconut Cloud', 'Coffee Mocha Swirl', 'Blueberry Blossom', 'Mango Passion',
  'Chocolate Chip Cookie', 'Butterscotch Bliss', 'Triple Chocolate Fudge',
  'Cookies and Cream', 'Belgian Brownie', 'Vanilla Ice Cream',
  'Rainbow Unicorn', 'Super Mario Adventure', 'Baby Pink Unicorn', 'Dora Explorer',
  'Spiderman Strike', 'Racing Cars', 'Frozen Snow Queen', 'Paw Patrol Pack',
  'Peppa Pig Party', 'Mickey Mouse Club', 'Tom and Jerry', 'Winnie the Pooh',
  'Avengers Assemble', 'Black Panther', 'Captain America', 'Princess Castle',
  'Barbie Dream', 'Butterfly Garden', 'Tropical Fruit Paradise', 'Oreo Cheesecake',
  'Pistachio Rose', 'Biscoff Crunch', 'Nutella Celebration', 'Chocolate Decadence',
];

const CUPCAKE_NAMES = [
  'Vanilla Buttercream', 'Chocolate Fudge', 'Red Velvet', 'Caramel Crunch',
  'Strawberry Cream', 'Lemon Drizzle', 'Lemon Blueberry', 'Cookie Crumble',
  'Salted Caramel', 'Peanut Butter', 'Coconut Snow', 'Espresso Coffee',
  'Mango Passion', 'Nutella Hazelnut', 'Matcha Green Tea', 'Rainbow Sprinkles',
];

const ANNIVERSARY_NAMES = [
  'Classic Three Tier', 'Rose Garden', 'Golden Celebration', 'Ruby Romance',
  'Silver Elegance', 'Tropical Love', 'Two Tier Delight', 'Floral Fantasy',
  'Pearl and Blush', 'Chocolate Truffle', 'Seasonal Fruit Tier', 'Cream and Gold',
  'Lavender Dreams', 'Pink Celebration', 'Grand Five Tier', 'Signature Drip',
];

const STRUCTURE_NAMES = [
  'Grand Ballroom Centrepiece', 'Wedding Stage Display', 'Tiered Table Array',
  'Luxury Dessert Table', 'Floral Gate Display', 'Cake and Macaron Tower',
  'Champagne Tier', 'Minimalist Monogram', 'Royal White Cascade', 'Pastel Petal Wall',
  'Chocolate Fountain Cake', 'Dessert Table Styling', 'Classic Round Display',
  'Two Tier Table Centre', 'Candlelight Tiered Stand', 'Marble Effect Showcase',
  'Garden Party Display', 'Reception Sweet Table', 'Blush and Gold Statement',
  'Three Level Showcase', 'Glass Tiered Display', 'Modern Minimal Display',
  'Luxury Floral Display', 'Grand Five Tier Centrepiece', 'Signature Wedding Structure',
];

/**
 * Copies an image from the front-end assets folder into `backend/uploads` and
 * returns the public path for it.
 */
const copyIntoUploads = (sourceFile, slug) => {
  if (!fs.existsSync(sourceFile)) return null;

  const extension = path.extname(sourceFile).toLowerCase() || '.jpg';
  const filename = `catalogue-${slug}${extension}`;
  fs.copyFileSync(sourceFile, path.join(UPLOAD_DIR, filename));

  return `/uploads/${filename}`;
};

const buildCatalogue = () => {
  const entries = [];

  const addFolder = (folder, type, names, prices, slug) => {
    const folderPath = path.join(FRONTEND_ASSETS, folder);
    if (!fs.existsSync(folderPath)) return;

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
      .sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));

    files.forEach((file, index) => {
      const image = copyIntoUploads(path.join(folderPath, file), `${slug}-${index + 1}`);
      if (!image) return;

      entries.push({
        name: names[index] || `${type} Design ${index + 1}`,
        type,
        price: prices[index] ?? prices[prices.length - 1],
        image,
        description: `${names[index] || type} — hand-finished to order with your message, colours and favourite details.`,
      });
    });
  };

  addFolder('birthday', 'Birthday Cake', BIRTHDAY_NAMES, BIRTHDAY_PRICES, 'birthday');
  addFolder('cupcake', 'Cupcake', CUPCAKE_NAMES, CUPCAKE_PRICES, 'cupcake');
  addFolder('anniversary', 'Anniversary Cake', ANNIVERSARY_NAMES, ANNIVERSARY_PRICES, 'anniversary');
  addFolder('structures', 'Wedding Structure', STRUCTURE_NAMES, Array(25).fill(55000), 'structure');

  const jarImage = copyIntoUploads(path.join(FRONTEND_ASSETS, 'jar.jpg'), 'jar');
  if (jarImage) {
    entries.push({
      name: 'Layered Jar Delight',
      type: 'Jar Cake',
      price: 1500,
      image: jarImage,
      description: 'Sponge, cream and toppings layered in a jar — perfect for gifts and dessert tables.',
    });
  }

  const weddingImage = copyIntoUploads(path.join(FRONTEND_ASSETS, 'weddingcake.jpg'), 'wedding');
  if (weddingImage) {
    entries.push({
      name: 'Classic Tiered Wedding Cake',
      type: 'Wedding Cake',
      price: 8000,
      image: weddingImage,
      description: 'Elegant tiered centrepiece in ivory, blush and gold — sized to your guest count.',
    });
  }

  // Highlight one design per category so the home page always shows a
  // varied mix instead of six cakes from the same collection.
  const FEATURE_ORDER = [
    'Birthday Cake',
    'Wedding Cake',
    'Cupcake',
    'Anniversary Cake',
    'Wedding Structure',
    'Jar Cake',
  ];

  const highlighted = new Set();
  entries.forEach((entry) => {
    if (highlighted.has(entry.type)) return;
    highlighted.add(entry.type);
    entry.featured = true;
  });

  // The home page shows the three newest highlighted designs, so stagger the
  // timestamps into a deliberate, attractive order.
  const baseTime = Date.now();
  FEATURE_ORDER.forEach((type, index) => {
    const entry = entries.find((item) => item.type === type && item.featured);
    if (!entry) return;
    entry.createdAt = new Date(baseTime - index * 60 * 60 * 1000);
  });

  return entries;
};

const findBakeryOwner = async () => {
  const owners = await mongoose.connection.db
    .collection('owners')
    .find({})
    .sort({ _id: 1 })
    .toArray();

  const realOwner = owners.find((owner) => !/test|example/i.test(owner.email || ''));
  if (!realOwner) {
    throw new Error('No owner account found. Register through /login first, then run this script again.');
  }

  return realOwner._id;
};

(async () => {
  const uri = process.env.MONGO_URI || process.env.mongo;

  if (!uri) {
    console.error('MongoDB connection string missing. Set MONGO_URI in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const ownerId = await findBakeryOwner();
  const catalogue = buildCatalogue();

  if (catalogue.length === 0) {
    console.error('No artwork found in frontend/src/assets - nothing was seeded.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Remove the old placeholder rows and any previous run of this seed.
  const removed = await Cake.deleteMany({
    $or: [{ source: 'catalogue' }, { image: /^data:image\/svg\+xml/i }],
  });
  console.log(`Removed ${removed.deletedCount} placeholder / previous catalogue row(s).`);

  await Cake.insertMany(
    catalogue.map((entry) => ({
      ...entry,
      ownerId,
      source: 'catalogue',
    }))
  );

  console.log(`Seeded ${catalogue.length} catalogue cakes.`);

  const counts = await Cake.aggregate([
    { $group: { _id: '$type', total: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  counts.forEach((row) => console.log(`  ${row._id.padEnd(20)} ${row.total}`));

  await mongoose.disconnect();
  console.log('Done.');
})().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
