const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER OWNER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Owner.findOne({ email });
    if (exists) return res.status(400).json({ message: "Owner already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Owner.create({ email, password: hashedPassword });

    res.json({ message: "Owner created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN OWNER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: owner._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY TOKEN
router.get("/verify", auth, async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    if (!owner) {
      return res.status(401).json({ message: "Owner not found" });
    }
    res.json({ message: "Token is valid", owner: { id: owner._id, email: owner.email } });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
