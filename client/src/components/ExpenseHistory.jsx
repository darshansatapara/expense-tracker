import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spin, Typography } from "antd";
import moment from "moment";
import { Box, TextField } from "@mui/material";
import client from "../axios";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import EditExpenseModal from "./EditExpenseModal"; // Modal for editing expenses

const ExpenseHistory = ({ userId }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs().startOf("month"), dayjs().endOf("month")]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentExpenses, setCurrentExpenses] = useState([]);

    const fetchExpenses = async (startDate, endDate) => {
        if (!startDate || !endDate) return;

        setLoading(true);
        try {
            const response = await client.get(`/expenses/getExpenses/${userId}/${startDate}/${endDate}`);
            setExpenses(response.data.expenses || []);
        } catch (error) {
            console.log("Error fetching expenses:");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            fetchExpenses(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
        }
    }, [userId, dateRange]);

    const handleRangeChange = (newRange) => {
        if (newRange && newRange[0] && newRange[1]) {
            setDateRange(newRange);
            fetchExpenses(newRange[0].format("YYYY-MM-DD"), newRange[1].format("YYYY-MM-DD"));
        } else {
            setExpenses([]);
        }
    };

    const handleEdit = (date) => {
        const selectedExpenses = expenses.find((exp) => exp.date === date)?.expenses || [];
        setCurrentExpenses(selectedExpenses);
        setIsModalVisible(true);
    };

    const handleExpenseUpdate = (updatedExpenses) => {
        setExpenses(updatedExpenses);
        fetchExpenses(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
        setCurrentExpenses(updatedExpenses);
    };

    const calculateTotals = (expenseGroup) => {
        let totalExpense = 0;
        let totalOnline = 0;
        let totalOffline = 0;

        if (Array.isArray(expenseGroup.expenses)) {
            expenseGroup.expenses.forEach((expense) => {
                const amount = expense._doc?.amount || 0;
                totalExpense += amount;
                if (expense.mode === "Online") totalOnline += amount;
                else if (expense.mode === "Offline") totalOffline += amount;
            });
        }

        return { totalExpense, totalOnline, totalOffline };
    };

    return (
        <Box>
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
            ) : expenses.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {expenses.map((expenseGroup) => {
                        const { totalExpense, totalOnline, totalOffline } = calculateTotals(expenseGroup);

                        return (
                            <Col key={expenseGroup.date} xs={24} sm={12} md={8} lg={8}>
                                <Card
                                    title={moment(expenseGroup.date).format("DD-MM-YYYY")}
                                    extra={<Button onClick={() => handleEdit(expenseGroup.date)}>Edit</Button>}
                                    style={{ marginBottom: "20px" }}
                                >
                                    <p><strong>Total Expense:</strong> ₹{totalExpense}</p>
                                    <p><strong>Online Total:</strong> ₹{totalOnline}</p>
                                    <p><strong>Offline Total:</strong> ₹{totalOffline}</p>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No expenses found for the selected date range.
                </Typography>
            )}

            <EditExpenseModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                expenses={currentExpenses}
                onUpdate={handleExpenseUpdate}
            />
        </Box>
    );
};

export default ExpenseHistory;
