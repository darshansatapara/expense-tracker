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

      // console.log(combinedExpenses, "1grouped")
      return { date: expenseGroup.date, expenses: combinedExpenses };
    });

    // console.log(groupedExpenses, "grouped")

    res.status(200).json({ expenses: groupedExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

//update the expense details
router.put("/updateExpense/:userId/:expenseDate", async (req, res) => {
  const { userId, expenseDate } = req.params;
  const { mode, amount, category, subcategory, description, expenseId } = req.body; // include expenseId

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

    // Remove the expense from its current mode array
    let expenseToUpdate;
    const currentModeArray = expenseDateObj.online.concat(expenseDateObj.offline);
    const expenseIndex = currentModeArray.findIndex(exp => exp._id.toString() === expenseId);

    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Update expense details
    expenseToUpdate = currentModeArray[expenseIndex];
    expenseToUpdate.amount = amount ?? expenseToUpdate.amount;
    expenseToUpdate.category = category ?? expenseToUpdate.category;
    expenseToUpdate.subcategory = subcategory ?? expenseToUpdate.subcategory;
    expenseToUpdate.description = description ?? expenseToUpdate.description;

    // Handle mode change by removing from current mode array and moving to the new one if necessary
    if (expenseToUpdate.mode !== mode) {
      // Remove from current array
      const oldModeArray = expenseToUpdate.mode === "Online" ? expenseDateObj.online : expenseDateObj.offline;
      oldModeArray.splice(expenseIndex, 1);

      // Update mode and add to the correct array
      expenseToUpdate.mode = mode;
      const newModeArray = mode === "Online" ? expenseDateObj.online : expenseDateObj.offline;
      newModeArray.push(expenseToUpdate);
    }

    // Save updated document
    await userExpenses.save();

    res.status(200).json({ message: "Expense updated successfully.", updatedExpense: expenseToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error });
  }
});


module.exports = router;
