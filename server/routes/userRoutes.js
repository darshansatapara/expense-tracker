const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

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
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the additional fields
    const user = new User({
      username,
      email,
      password: hashedPassword,
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

// Sign-in route
router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", user);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Hash the incoming password
    const isMatch = await bcrypt.hash(password, user.password);

    // Compare the hashed password with the password in the database
    // const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      console.log("Passwords do not match:", password, user.password);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    next(err); // Pass errors to the error-handling middleware
  }
});

module.exports = router;
