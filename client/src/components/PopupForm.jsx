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

function PopupForm({ open, handleClose, formValues, setFormValues }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryData, setCategoryData] = useState({});

  const userId = localStorage.getItem("UserId"); // Assuming UserId is stored in localStorage
  const UserMail = localStorage.getItem("UserMail"); // Assuming UserId is stored in localStorage

  useEffect(() => {
    client
      .get(`/categories/getcategories/${UserMail}`)
      .then((response) => {
        const fetchedCategories = response.data.categories;
        setCategories(Object.keys(fetchedCategories));
        setCategoryData(fetchedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setSubcategories(categoryData[value]?.subcategories || []);
      setFormValues({
        ...formValues,
        [name]: value,
        subCategory: "",
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = () => {
    const expenseData = {
      date: formValues.date,
      mode: formValues.paymentMode,
      amount: formValues.amount,
      category: formValues.category,
      subcategory: formValues.subCategory,
      description: formValues.description,
    };

    // Log the expense data to verify it's structured correctly
    console.log("Expense data to send:", expenseData);

    // API call to add the expense
    client
      .post("/expenses/addExpense", {
        userId: userId,
        date: formValues.date, // Grouping by date
        mode: formValues.paymentMode, // Add mode directly to send
        amount: formValues.amount, // Add amount directly to send
        category: formValues.category, // Add category directly to send
        subcategory: formValues.subCategory, // Add subcategory directly to send
        description: formValues.description, // Add description directly to send
      })
      .then((response) => {
        console.log("Expense added successfully:", response.data);
        handleClose(); // Close the modal on successful save
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
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
          Add Transaction
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
          label="Payment Mode"
          name="paymentMode"
          select
          value={formValues.paymentMode}
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
          label="Subcategory"
          name="subCategory"
          select
          value={formValues.subCategory}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {subcategories.map((subcat) => (
            <MenuItem key={subcat} value={subcat}>
              {subcat}
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

export default PopupForm;
