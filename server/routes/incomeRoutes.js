const express = require("express");
const router = express.Router();
const UserIncome = require("../models/IncomeModel"); // Import the UserIncome model

// Route to add income
router.post("/addIncome", async (req, res) => {
    const { userId, date, mode, amount, category, description } = req.body;

    // Validate required fields
    if (!userId || !date || !mode || !amount || !category) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields.",
        });
    }

    // Create a new income entry
    const newIncomeEntry = {
        date,
        mode,
        amount,
        category,
        description,
    };

    try {
        // Find the user's income document
        let userIncome = await UserIncome.findOne({ userId });

        if (!userIncome) {
            // Create a new document if it doesn't exist
            userIncome = new UserIncome({
                userId,
                incomes: [
                    {
                        date: date,
                        online: mode.toLowerCase() === "online" ? [newIncomeEntry] : [],
                        offline: mode.toLowerCase() === "offline" ? [newIncomeEntry] : [],
                    },
                ],
            });
        } else {
            // Check if an income entry exists for this date
            const incomeDateEntry = userIncome.incomes.find(
                (income) => income.date === date
            );

            if (incomeDateEntry) {
                // Push to the relevant array (online or offline) based on mode
                if (mode.toLowerCase() === "online") {
                    incomeDateEntry.online.push(newIncomeEntry);
                } else {
                    incomeDateEntry.offline.push(newIncomeEntry);
                }
            } else {
                // If no income entry for this date, create one
                userIncome.incomes.push({
                    date: date,
                    online: mode.toLowerCase() === "online" ? [newIncomeEntry] : [],
                    offline: mode.toLowerCase() === "offline" ? [newIncomeEntry] : [],
                });
            }
        }

        // Save the updated or new document
        await userIncome.save();

        return res.status(201).json({
            success: true,
            message: "Income added successfully.",
            data: userIncome,
        });
    } catch (error) {
        console.error("Error adding income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});


// Route to update an income entry using userId and date as params
router.put('/updateIncome/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;
    const { amount, category, description, incomeId, mode } = req.body;

    console.log(req.body, "body");
    try {
        // Find the user income document for the specified userId
        const userIncome = await UserIncome.findOne({ userId });

        // Check if the user income document exists
        if (!userIncome) {
            return res.status(404).json({ success: false, message: 'User income document not found.' });
        }

        // Find the specific income group (by date) within the incomes array
        const incomeGroup = userIncome.incomes.find(group => group.date === date);
        if (!incomeGroup) {
            return res.status(404).json({ success: false, message: 'No income entry found for the specified date.' });
        }

        // Find and remove the specific income item by incomeId from its current mode array
        let incomeItem;
        let currentModeArray;
        let itemIndex;

        // Check if it's in the 'online' array
        if (incomeGroup.online) {
            itemIndex = incomeGroup.online.findIndex(item => item._id.toString() === incomeId);
            if (itemIndex !== -1) {
                incomeItem = incomeGroup.online[itemIndex];
                currentModeArray = incomeGroup.online;
            }
        }

        // If not found in 'online', check the 'offline' array
        if (!incomeItem && incomeGroup.offline) {
            itemIndex = incomeGroup.offline.findIndex(item => item._id.toString() === incomeId);
            if (itemIndex !== -1) {
                incomeItem = incomeGroup.offline[itemIndex];
                currentModeArray = incomeGroup.offline;
            }
        }

        // If incomeItem is not found, return an error
        if (!incomeItem) {
            return res.status(404).json({ success: false, message: 'Specified income item not found within the mode.' });
        }

        // Update the fields in the specific income item
        if (amount !== undefined) incomeItem.amount = amount;
        if (category !== undefined) incomeItem.category = category;
        if (description !== undefined) incomeItem.description = description;

        // Check for mode change
        if (incomeItem.mode !== mode) {
            // Remove the item from the current mode array
            currentModeArray.splice(itemIndex, 1);

            // Update the mode and move to the new mode array
            incomeItem.mode = mode;
            const newModeArray = mode === "Online" ? incomeGroup.online : incomeGroup.offline;
            newModeArray.push(incomeItem);
        }

        // Save the updated document
        await userIncome.save();

        res.status(200).json({ success: true, message: 'Income updated successfully.', data: incomeItem });
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the income.' });
    }
});

// Route to get income entries by userId and date range
router.get("/getIncomes/:userId/:startDate/:endDate", async (req, res) => {
    const { userId, startDate, endDate } = req.params;

    try {
        // Find the user's income data within the specified date range
        const userIncomeData = await UserIncome.findOne({ userId });

        if (!userIncomeData) {
            return res.status(404).json({
                success: false,
                message: "No income data found for the user.",
            });
        }

        // Filter incomes within the date range and organize by date
        const incomeByDate = {};

        userIncomeData.incomes.forEach((incomeDay) => {
            const incomeDate = incomeDay.date;

            // Only process dates within the range
            if (incomeDate >= startDate && incomeDate <= endDate) {
                incomeByDate[incomeDate] = incomeByDate[incomeDate] || { online: [], offline: [] };

                // Add incomes to respective arrays
                incomeByDate[incomeDate].online.push(...incomeDay.online);
                incomeByDate[incomeDate].offline.push(...incomeDay.offline);
            }
        });

        // Convert the object to an array format if needed
        const organizedData = Object.entries(incomeByDate).map(([date, incomes]) => ({
            date,
            ...incomes,
        }));

        res.status(200).json({
            success: true,
            incomes: organizedData,
        });
    } catch (error) {
        console.error("Error fetching income data:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving income data.",
            error: error.message,
        });
    }
});
module.exports = router;
