const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE LOGIN
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      // Since it's Google login, we don't need a password, 
      // but the model might require it. We'll use a random placeholder.
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        profilePicture: picture,
      });
      await user.save();
    }

    // CREATE JWT
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      message: "Google login successful",
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("GOOGLE LOGIN FAIL:", err);
    res.status(400).json({ 
      message: "Google verification failed", 
      error: err.message 
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    // USER NOT FOUND
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      message: "Login successful"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER (DISABLED - ONLY GOOGLE ALLOWED)
router.post("/register", async (req, res) => {
  return res.status(403).json({ 
    message: "Manual registration is disabled to ensure authenticity. Please use Sign in with Google." 
  });
});

module.exports = router;