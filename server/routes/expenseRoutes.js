const express = require("express");
const router = express.Router();
const UserExpense = require("../models/ExpenseModel");
const { default: mongoose } = require("mongoose");

// Add an expense
router.post("/addExpense", async (req, res) => {
  const { userId, date, mode, amount, category, subcategory, description } = req.body;

  try {
    // Find the user's expense document
    let userExpense = await UserExpense.findOne({ userId });

    // Create the new expense object
    const newExpense = {
      date,
      mode,
      amount,
      category,
      subcategory,
      description,
    };

    // If the user doesn't have any expenses yet, create a new one
    if (!userExpense) {
      userExpense = new UserExpense({
        userId,
        expenses: [{ date, online: [], offline: [] }],
      });

      if (mode === "Online") {
        userExpense.expenses[0].online.push(newExpense);
      } else if (mode === "Offline") {
        userExpense.expenses[0].offline.push(newExpense);
      }
    } else {
      // Check if an expense for the given date exists
      let expenseForDate = userExpense.expenses.find(exp => exp.date === date);

      if (expenseForDate) {
        // If the date exists, push the new expense to the respective mode
        if (mode === "Online") {
          expenseForDate.online.push(newExpense);
        } else if (mode === "Offline") {
          expenseForDate.offline.push(newExpense);
        }
      } else {
        // If the date doesn't exist, create a new expense entry for the date
        const newDateEntry = {
          date,
          online: mode === "Online" ? [newExpense] : [],
          offline: mode === "Offline" ? [newExpense] : [],
        };

        userExpense.expenses.push(newDateEntry);
      }
    }

    // Save the updated expense entry to the database
    await userExpense.save();

    res.status(201).json({ message: "Expense added successfully", userExpense });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error });
  }
});


// Assuming you are using Express and have a UserExpense model defined
router.get("/getExpenses/:userId/:startDate/:endDate", async (req, res) => {
  const { userId, startDate, endDate } = req.params;

  try {
    const userExpenses = await UserExpense.findOne({ userId });

    if (!userExpenses) {
      return res.status(404).json({ message: "No expenses found for this user" });
    }

    const filteredExpenses = userExpenses.expenses.filter((expenseGroup) => {
      const expenseDate = new Date(expenseGroup.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });

    if (!filteredExpenses.length) {
      return res.status(404).json({ message: "No expenses found for this date range" });
    }

    const groupedExpenses = filteredExpenses.map((expenseGroup) => {
      const combinedExpenses = [
        ...expenseGroup.online.map((expense) => ({ ...expense, mode: "Online" })),
        ...expenseGroup.offline.map((expense) => ({ ...expense, mode: "Offline" })),
      ];

      console.log(combinedExpenses,"1grouped")
      return { date: expenseGroup.date, expenses: combinedExpenses };
    });

    console.log(groupedExpenses,"grouped")

    res.status(200).json({ expenses: groupedExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

router.put("/updateExpense/:userId/:expenseDate", async (req, res) => {
  const { userId, expenseDate } = req.params; // User ID and expense date from request parameters
  const { mode, amount, category, subcategory, description } = req.body; // New expense details from request body

  try {
    // Find the user expense document
    const userExpenses = await UserExpense.findOne({ userId });

    if (!userExpenses) {
      return res.status(404).json({ message: "User expenses not found." });
    }

    // Find the expense object for the specified date
    const expenseDateObj = userExpenses.expenses.find(expense => expense.date === expenseDate);
    
    if (!expenseDateObj) {
      return res.status(404).json({ message: "Expense date not found." });
    }

    // Determine whether the expense is online or offline based on the mode
    const expenseArray = mode === "Online" ? expenseDateObj.online : expenseDateObj.offline;

    // Find the expense to update (you might need an ID or index to identify it uniquely)
    const expenseToUpdate = expenseArray.find(exp => {
      // Assuming that each expense has a unique identifier, like _id
      return exp._id.toString() === req.body.expenseId; // `expenseId` must be provided in the request body
    });

    if (!expenseToUpdate) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Update the expense details
    if (amount) expenseToUpdate.amount = amount;
    if (category) expenseToUpdate.category = category;
    if (subcategory) expenseToUpdate.subcategory = subcategory;
    if (description) expenseToUpdate.description = description;

    // Save the updated user expense document
    await userExpenses.save();

    return res.status(200).json({ message: "Expense updated successfully.", updatedExpense: expenseToUpdate });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error.", error });
  }
});
module.exports = router;
