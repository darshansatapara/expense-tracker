import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../css/Home.css"
import Sidebar from "../components/Sidebar";
import ContentPage from "../components/MyContent";
import { Box, Button } from "@mui/material";
import ExpensePopupForm from "../components/ExpensePopupForm.jsx";
import IncomePopupForm from "../components/IncomePopupForm.jsx";

function Home() {
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);

  // Initialize the form values
  const ExpenseFormValues = {
    date: new Date().toISOString().split("T")[0], // Set to current date by default
    paymentMode: "Online",
    amount: "",
    category: "",
    subCategory: "",
    description: "",
  };
  const IncomeFormValues = {
    date: new Date().toISOString().split("T")[0], //Set to current date by default
    incomeMode: "Online",
    amount: "",
    category: "",
    description: "",
  };

  const [ExpenseformValues, setExpenseFormValues] = useState(ExpenseFormValues);
  const [IncomeformValues, setIncomeFormValues] = useState(IncomeFormValues);

  // Function to handle opening the form modal
  const handleOpenExpenseForm = () => {
    setIsExpenseFormOpen(true);
  };
  const handleOpenIncomeForm = () => {
    setIsIncomeFormOpen(true);
  };

  // Function to handle closing the form modal
  const handleExpenseCloseForm = () => {
    setExpenseFormValues(ExpenseFormValues); // Reset form values when modal is closed
    setIsExpenseFormOpen(false);
  };
  const handleIncomeCloseForm = () => {
    setIncomeFormValues(IncomeFormValues); // Reset form values when modal is closed
    setIsIncomeFormOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: "48px", sm: "48px" },
          m: "100px",
        }}
      >
        <ContentPage />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenExpenseForm}
          sx={{ mt: 2 }}
        >
          Add Transaction
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenIncomeForm}
          sx={{ mt: 2, ml: 2 }}
        >
          Add Income
        </Button>

        {/* PopupForm component to show the modal */}
        <ExpensePopupForm
          open={isExpenseFormOpen}
          formValues={ExpenseformValues}
          setFormValues={setExpenseFormValues}
          handleClose={handleExpenseCloseForm} // Use handleCloseForm as form submission will be handled in PopupForm
        />
        <IncomePopupForm
          open={isIncomeFormOpen}
          formValues={IncomeformValues}
          setFormValues={setIncomeFormValues}
          handleClose={handleIncomeCloseForm} // Use handleCloseForm as form submission will be handled in PopupForm
        />
      </Box>
    </Box>
  );
}

export default Home;
