// routes/userRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Sign-up route
router.post("/signup", async (req, res, next) => {
  const {
    username,
    email,
    password,
    name,
    mobile_no,
    date_of_birth,
    category,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !name ||
    !mobile_no ||
    !date_of_birth ||
    !category
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    // Create a new user with the additional fields
    const user = new User({
      username,
      email,
      password,
      name,
      mobile_no,
      date_of_birth,
      category,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
        mobile_no: user.mobile_no,
        date_of_birth: user.date_of_birth,
        category: user.category,
      },
    });
  } catch (err) {
    next(err); // Pass errors to the error-handling middleware
  }
});

module.exports = router;
