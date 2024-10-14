const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  date: { type: String, required: true },
  mode: { type: String, enum: ["Online", "Offline"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: false },
  subcategory: { type: String, required: false },
  description: { type: String, required: false },
});

const userExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expenses: [
    {
      date: { type: String, required: true }, // Store the date for grouping
      online: [expenseSchema], // Array for online expenses
      offline: [expenseSchema], // Array for offline expenses
    },
  ],
});

const UserExpense = mongoose.model("UserExpense", userExpenseSchema);

module.exports = UserExpense;
