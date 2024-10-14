import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spin, message } from "antd";
import moment from "moment";
import { Box, TextField, Typography } from "@mui/material";
import client from "../axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EditExpenseModal from "../components/EditExpenseModal"; // Import the modal
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";

const HistoryPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([dayjs().startOf("month"), dayjs().endOf("month")]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentExpenses, setCurrentExpenses] = useState([]);
  const userId = localStorage.getItem("UserId");

  const fetchExpenses = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      return; // Prevent fetch if dates are invalid or null
    }

    setLoading(true);
    try {
      const response = await client.get(`/expenses/getExpenses/${userId}/${startDate}/${endDate}`);
      console.log("Fetched expenses:", response.data.expenses); // Log the response
      setExpenses(response.data.expenses || []); // Ensure an empty array if no expenses
    } catch (error) {
      console.error("Error fetching expenses:", error);
      message.error("No expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchExpenses(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
    }
  }, [userId, dateRange]);


  useEffect(() => {
    fetchExpenses(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
  }, [userId, dateRange]);

  const handleRangeChange = (newRange) => {
    if (newRange && newRange[0] && newRange[1]) {
      setDateRange(newRange);
      fetchExpenses(newRange[0].format("YYYY-MM-DD"), newRange[1].format("YYYY-MM-DD"));
    } else {
      setExpenses([]); // Clear the expense list if the date range is invalid
    }
  };


  const handleEdit = (date) => {
    const selectedExpenses = expenses.find((exp) => exp.date === date)?.expenses || [];
    setCurrentExpenses(selectedExpenses);
    setIsModalVisible(true);
  };

  const handleExpenseUpdate = (updatedExpenses) => {
    setExpenses(updatedExpenses);
    // Update the state in the parent component with the new list
    fetchExpenses(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")); // Call fetchExpenses again to refresh data
    setCurrentExpenses(updatedExpenses);
  };

  // Filter expenses within the selected date range
  const filteredExpenses = expenses.filter((expenseGroup) => {
    const expenseDate = dayjs(expenseGroup.date);
    return expenseDate.isBetween(dateRange[0], dateRange[1], null, "[]"); // Inclusive filter for date range
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: "48px", sm: "48px" }, // Adjust this value to prevent overlap with the navbar
          m: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4, mt: 4 }}>
          Expense History
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            startText="Start"
            endText="End"
            value={dateRange}
            onChange={handleRangeChange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </>
            )}
            format="DD-MM-YYYY"
            sx={{ marginBottom: "20px" }}
          />
        </LocalizationProvider>

        {loading ? (
          <Spin />
        ) : filteredExpenses.length > 0 ? ( // Check if expenses are present after filtering
          <Row gutter={[16, 16]}>
            {filteredExpenses.map((expenseGroup) => {
              const totalExpense = Array.isArray(expenseGroup.expenses)
                ? expenseGroup.expenses.reduce((acc, expense) => acc + (expense._doc?.amount || 0), 0)
                : 0;

              return (
                <Col
                  key={expenseGroup.date}
                  xs={24} // 1 column for extra small devices (phones)
                  sm={12} // 2 columns for small devices (tablets)
                  md={8} // 3 columns for medium devices (laptops)
                  lg={8} // 3 columns for large devices (desktops)
                >
                  <Card
                    title={moment(expenseGroup.date).format("DD-MM-YYYY")}
                    extra={<Button onClick={() => handleEdit(expenseGroup.date)}>Edit</Button>}
                    style={{ marginBottom: "20px" }}
                  >
                    <p>Total Expense: {totalExpense}</p>
                    <p>
                      Details:{" "}
                      {Array.isArray(expenseGroup.expenses)
                        ? expenseGroup.expenses
                          .map((exp) => `${exp.mode}: ${exp._doc?.amount || 0}`)
                          .join(", ")
                        : "No expenses available"}
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : ( // Display a friendly message if no expenses are found after filtering
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No expenses found for the selected date range.
          </Typography>
        )}
      </Box>

      {/* Edit Expense Modal */}
      <EditExpenseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        expenses={currentExpenses}
        onUpdate={handleExpenseUpdate}
      />
    </Box>
  );
};

export default HistoryPage;
