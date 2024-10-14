import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ContentPage from "../components/MyContent";
import { Box, Button } from "@mui/material";
import PopupForm from "../components/PopupForm.jsx";

function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize the form values
  const initialFormValues = {
    date: new Date().toISOString().split("T")[0], // Set to current date by default
    paymentMode: "Online",
    amount: "",
    category: "",
    subCategory: "",
    description: "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  // Function to handle opening the form modal
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  // Function to handle closing the form modal
  const handleCloseForm = () => {
    setFormValues(initialFormValues); // Reset form values when modal is closed
    setIsFormOpen(false);
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
          onClick={handleOpenForm}
          sx={{ mt: 2 }}
        >
          Add Transaction
        </Button>

        {/* PopupForm component to show the modal */}
        <PopupForm
          open={isFormOpen}
          formValues={formValues}
          setFormValues={setFormValues}
          handleClose={handleCloseForm} // Use handleCloseForm as form submission will be handled in PopupForm
        />
      </Box>
    </Box>
  );
}

export default Home;
