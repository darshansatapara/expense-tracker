const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const User = require("../models/User");

// Create a new category with subcategories
router.post("/create/:email", async (req, res) => {
  try {
    const { categoriesData } = req.body; // Expecting an object where keys are category names and values are objects with subcategories

    const email = req.params.email; // Get the email from URL parameters

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new category entry
    const category = new Category({
      userId: user._id, // Use the userId from the found user
      categories: categoriesData,
    });

    // Save the category
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories by user's email
router.get("/getcategories/:email", async (req, res) => {
  try {
    const email = req.params.email; // Get the email from URL parameters

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find categories associated with the user's userId
    const categories = await Category.findOne({ userId: user._id });
    if (!categories) {
      return res
        .status(404)
        .json({ error: "No categories found for this user" });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;