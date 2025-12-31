const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

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

module.exports = router;
