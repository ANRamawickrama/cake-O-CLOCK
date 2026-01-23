// Script to add test cakes to database
const mongoose = require("mongoose");
const Cake = require("./models/cake");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || process.env.mongo;

const testCakes = [
  {
    ownerId: "507f1f77bcf86cd799439011", // Placeholder owner ID
    type: "Birthday Cake",
    price: 2500,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23FF69B4' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='white' font-size='20' font-weight='bold'%3EBirthday Cake%3C/text%3E%3C/svg%3E",
    description: "Delicious chocolate birthday cake with sprinkles"
  },
  {
    ownerId: "507f1f77bcf86cd799439011",
    type: "Birthday Cake",
    price: 3000,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23FFD700' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='black' font-size='20' font-weight='bold'%3EVanilla Cake%3C/text%3E%3C/svg%3E",
    description: "Vanilla cake with golden frosting"
  },
  {
    ownerId: "507f1f77bcf86cd799439011",
    type: "Anniversary Cake",
    price: 4000,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23C71585' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='white' font-size='20' font-weight='bold'%3EAnniversary%3C/text%3E%3C/svg%3E",
    description: "Romantic red velvet cake for special occasions"
  },
  {
    ownerId: "507f1f77bcf86cd799439011",
    type: "Wedding Cake",
    price: 8000,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23FFFFFF' width='200' height='200' stroke='%23FFD700' stroke-width='2'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='black' font-size='18' font-weight='bold'%3EWedding Cake%3C/text%3E%3C/svg%3E",
    description: "3-tier elegant white wedding cake"
  },
  {
    ownerId: "507f1f77bcf86cd799439011",
    type: "Cupcake",
    price: 500,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23FF1493' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='white' font-size='20' font-weight='bold'%3ECupcake%3C/text%3E%3C/svg%3E",
    description: "Individual cupcakes with assorted flavors"
  },
  {
    ownerId: "507f1f77bcf86cd799439011",
    type: "Jar Cake",
    price: 1500,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23DEB887' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='%23654321' font-size='20' font-weight='bold'%3EJar Cake%3C/text%3E%3C/svg%3E",
    description: "Layered jar cake with multiple flavors"
  },
  {
    ownerId: "507f1f77bcf86cd799439011",
    type: "Wedding Structure",
    price: 12000,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23E0E0E0' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='black' font-size='18' font-weight='bold'%3EWedding Structure%3C/text%3E%3C/svg%3E",
    description: "Large wedding cake structure with multiple tiers"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete existing cakes (optional - comment out to keep existing)
    // await Cake.deleteMany({});
    // console.log("🗑️ Deleted existing cakes");

    // Add test cakes
    const result = await Cake.insertMany(testCakes);
    console.log(`✅ Added ${result.length} test cakes to database`);

    // Show what was added
    const allCakes = await Cake.find().sort({ type: 1 });
    console.log("\n📊 Current cakes in database:");
    allCakes.forEach((cake) => {
      console.log(`  - ${cake.type}: Rs. ${cake.price}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedDatabase();
