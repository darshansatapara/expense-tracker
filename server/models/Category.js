const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categories: {
    type: Map,
    of: {
      subcategories: [{ type: String }],
    },
  },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
