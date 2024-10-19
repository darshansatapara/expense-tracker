const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const User = require("../models/User");
router.post("/create/:email", async (req, res) => {
  try {
    const { categoriesData } = req.body;
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Transform categoriesData to match the schema
    const transformedCategoriesData = Object.keys(categoriesData).reduce(
      (acc, category) => {
        acc[category] = { subcategories: categoriesData[category] }; // Ensure it's in the right format
        return acc;
      },
      {}
    );

    const category = new Category({
      userId: user._id,
      categories: transformedCategoriesData,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error saving category:", error); // Log the error for debugging
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

// Get categories by user's id
router.get("/getcategories/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Get the email from URL parameters
    console.log("i am here");
    // Find the user by email
    const user = await User.findOne({ userId });
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
