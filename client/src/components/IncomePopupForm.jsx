import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
} from "@mui/material";
import client from "../axios"; // Axios client instance for making API calls
import incomeSources from "../utils/incomeSources"; // Import income sources list

function IncomePopupForm({ open, handleClose, formValues, setFormValues }) {
    const [categories, setCategories] = useState([]);
    const [userType, setUserType] = useState("");

    const userId = localStorage.getItem("UserId");

    useEffect(() => {
        // Fetch the user type first
        client
            .get(`/users/user/${userId}`)
            .then((response) => {
                const fetchedUserType = response.data.user.category.toLowerCase();
                setUserType(fetchedUserType);
                // Set categories based on fetched user type
                setCategories(incomeSources[fetchedUserType] || []);
            })
            .catch((error) => {
                console.error("Error fetching user type:", error);
            });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleFormSubmit = () => {
        const incomeData = {
            date: formValues.date,
            mode: formValues.incomeMode,
            amount: formValues.amount,
            category: formValues.category,
            description: formValues.description,
        };

        console.log("Income data to send:", incomeData);

        // API call to add the income
        client
            .post("/income/addIncome", {
                userId: userId,
                date: formValues.date,
                mode: formValues.incomeMode,
                amount: formValues.amount,
                category: formValues.category,
                description: formValues.description,
            })
            .then((response) => {
                console.log("Income added successfully:", response.data);
                handleClose();
            })
            .catch((error) => {
                console.error("Error adding income:", error);
            });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Add Income
                </Typography>

                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={formValues.date}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Income Mode"
                    name="incomeMode"
                    select
                    value={formValues.incomeMode}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="Offline">Offline</MenuItem>
                </TextField>

                <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formValues.amount}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Category"
                    name="category"
                    select
                    value={formValues.category}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={formValues.description}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFormSubmit}
                    fullWidth
                >
                    Add
                </Button>
            </Box>
        </Modal>
    );
}

export default IncomePopupForm;
