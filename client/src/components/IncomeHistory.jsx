import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spin, Typography } from "antd";
import moment from "moment";
import { Box, TextField } from "@mui/material";
import client from "../axios";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import EditIncomeModal from "./EditIncomeModel";


const IncomeHistory = ({ userId }) => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs().startOf("month"), dayjs().endOf("month")]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentIncomes, setCurrentIncomes] = useState([]);

    // Fetch incomes based on user ID and selected date range
    const fetchIncomes = async (startDate, endDate) => {
        if (!startDate || !endDate) return;

        setLoading(true);
        try {
            const response = await client.get(`/income/getIncomes/${userId}/${startDate}/${endDate}`);
            console.log("income response", response.data.incomes)
            setIncomes(response.data.incomes || []);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch incomes when dateRange or userId changes
    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            fetchIncomes(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
        }
    }, [userId, dateRange]);

    // Handle date range changes
    const handleRangeChange = (newRange) => {
        if (newRange && newRange[0] && newRange[1]) {
            setDateRange(newRange);
            fetchIncomes(newRange[0].format("YYYY-MM-DD"), newRange[1].format("YYYY-MM-DD"));
        } else {
            setIncomes([]); // Clear incomes if date range is invalid
        }
    };

    // Open edit modal with selected income data
    const handleEdit = (date) => {
        const selectedIncomeGroup = incomes.find((inc) => inc.date === date);

        if (selectedIncomeGroup) {
            const selectedIncomes = [
                ...(selectedIncomeGroup.online || []),
                ...(selectedIncomeGroup.offline || [])
            ];

            setCurrentIncomes(selectedIncomes); // Set the currentIncomes correctly here
            console.log("current income", currentIncomes);
            setIsModalVisible(true); // Open the modal only after setting currentIncomes
        }
    };

    // Update incomes after editing
    const handleIncomeUpdate = (updatedIncomes) => {
        setIncomes(updatedIncomes);
        fetchIncomes(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
        setCurrentIncomes(updatedIncomes);
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
            ) : incomes.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {incomes.map((incomeGroup) => {
                        // Calculate online and offline totals
                        const onlineTotal = incomeGroup.online
                            ? incomeGroup.online.reduce((acc, inc) => acc + (inc.amount || 0), 0)
                            : 0;

                        const offlineTotal = incomeGroup.offline
                            ? incomeGroup.offline.reduce((acc, inc) => acc + (inc.amount || 0), 0)
                            : 0;

                        const totalIncome = onlineTotal + offlineTotal;

                        return (
                            <Col key={incomeGroup.date} xs={24} sm={12} md={8} lg={8}>
                                <Card
                                    title={moment(incomeGroup.date).format("DD-MM-YYYY")}
                                    extra={<Button onClick={() => handleEdit(incomeGroup.date)}>Edit</Button>}
                                    style={{ marginBottom: "20px" }}
                                >
                                    <p><strong>Total Expense:</strong> ₹{totalIncome}</p>
                                    <p><strong>Online Total:</strong> ₹{onlineTotal}</p>
                                    <p><strong>Offline Total:</strong> ₹{offlineTotal}</p>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No incomes found for the selected date range.
                </Typography>
            )}

            {/* Edit Income Modal */}
            <EditIncomeModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                incomes={currentIncomes}
                onUpdate={handleIncomeUpdate}
            />
        </Box>
    );
};

export default IncomeHistory;
