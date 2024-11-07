// HistoryPage.js
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExpenseHistory from "../components/ExpenseHistory"; // Import Expense History
import IncomeHistory from "../components/IncomeHistory"; // Import Income History

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("expense");
  const userId = localStorage.getItem("UserId");

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
          m: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4, mt: 4 }}>
          {activeTab === "expense" ? "Expense History" : "Income History"}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Button
            variant={activeTab === "expense" ? "contained" : "outlined"}
            onClick={() => setActiveTab("expense")}
            sx={{ marginRight: "10px" }}
          >
            Expense
          </Button>
          <Button
            variant={activeTab === "income" ? "contained" : "outlined"}
            onClick={() => setActiveTab("income")}
          >
            Income
          </Button>
        </Box>

        {activeTab === "expense" ? (
          <ExpenseHistory userId={userId} />
        ) : (
          <IncomeHistory userId={userId} />
        )}
      </Box>
    </Box>
  );
};

export default HistoryPage;
