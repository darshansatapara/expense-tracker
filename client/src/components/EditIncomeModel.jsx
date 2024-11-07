import React, { useEffect, useState } from "react";
import { Modal, Button, List, Input, message, Card, Form, Row, Col, Select } from "antd";
import moment from "moment";
import client from "../axios";
import incomeSources from "../utils/incomeSources";
import "../css/EditExpenseModal.css";

const EditIncomeModal = ({ visible, onClose, incomes, onUpdate }) => {
    const [editableIncomes, setEditableIncomes] = useState([]);
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        // Directly use the incoming incomes array
        setEditableIncomes(incomes);
        console.log("Editable incomes:", incomes);
    }, [incomes]);

    const UserId = localStorage.getItem("UserId");

    useEffect(() => {
        client
            .get(`/users/user/${UserId}`)
            .then((response) => {
                const fetchedUserType = response.data.user.category.toLowerCase();
                setUserType(fetchedUserType);
                setCategories(incomeSources[fetchedUserType] || []);
            })
            .catch((error) => {
                console.error("Error fetching user type:", error);
            });
    }, [UserId]);

    const handleUpdate = (index) => {
        const selected = editableIncomes[index];
        setSelectedIncome(selected);
        setFormVisible(true);
    };

    const handleFormSubmit = (values) => {
        const incomeDate = selectedIncome?.date;
        const incomeId = selectedIncome?._id;

        if (!incomeDate || !incomeId) {
            message.error("Income data is missing or invalid.");
            return;
        }

        const updatedValues = {
            ...values,
            incomeId,
            mode: values.mode,
        };
        console.log(updatedValues, "updated values");

        client
            .put(`/income/updateIncome/${UserId}/${incomeDate}`, updatedValues)
            .then((response) => {
                message.success("Income updated successfully!");

                const updatedIncome = { ...selectedIncome, ...updatedValues };
                const updatedIncomesList = editableIncomes.map((income) =>
                    income._id === incomeId ? updatedIncome : income
                );

                setEditableIncomes(updatedIncomesList);
                setFormVisible(false);
                onUpdate(updatedIncomesList);
            })
            .catch((error) => {
                message.error("Error updating income.");
                console.error(error);
            });
    };

    return (
        <Modal
            title="Edit Incomes"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width="90%"
            style={{ maxWidth: '800px' }}
        >
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={editableIncomes}
                renderItem={(income, index) => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                padding: '16px',
                            }}
                        >
                            <Row gutter={[16, 16]} style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Col>
                                    <p><strong>Date:</strong> {moment(income.date).format("DD-MM-YYYY")}</p>
                                    <p><strong>Mode:</strong> {income.mode}</p>
                                </Col>
                                <Col>
                                    <p><strong>Amount:</strong> ₹{income.amount}</p>
                                    <p><strong>Category:</strong> {income.category}</p>
                                </Col>
                                <Col>
                                    <p><strong>Description:</strong> {income.description}</p>
                                </Col>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Button onClick={() => handleUpdate(index)} type="primary">Edit</Button>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />

            {/* Popup Form for Editing Income */}
            <Modal
                title="Edit Income Details"
                visible={formVisible}
                onCancel={() => setFormVisible(false)}
                footer={null}
                width="90%"
                style={{ maxWidth: '600px' }}
            >
                <Form
                    initialValues={{
                        amount: selectedIncome?.amount,
                        category: selectedIncome?.category,
                        description: selectedIncome?.description,
                        mode: selectedIncome?.mode,
                    }}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please input the amount!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select style={{ width: '100%' }}>
                            {categories.map((category) => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Mode"
                        name="mode"
                        rules={[{ required: true, message: 'Please select a mode!' }]}
                    >
                        <Select style={{ width: '100%' }}>
                            <Select.Option value="Online">Online</Select.Option>
                            <Select.Option value="Offline">Offline</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: false }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Update Income</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};

export default EditIncomeModal;
