import React, { useEffect, useState } from "react";
import { Modal, Button, List, Input, message, Card, Form, Row, Col, Select } from "antd";
import moment from "moment";
import client from "../axios"; // Your axios instance or fetch function
import "../css/EditExpenseModal.css";

const EditExpenseModal = ({ visible, onClose, expenses, onUpdate }) => {
  const [editableExpenses, setEditableExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  useEffect(() => {
    setEditableExpenses(expenses);
  }, [expenses]);

  const UserMail = localStorage.getItem("UserMail");

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
  }, [UserMail]);

  const handleCategoryChange = (value) => {
    const selectedCategory = categoryData[value];
    setSubcategoryOptions(selectedCategory ? selectedCategory.subcategories : []);
  };

  useEffect(() => {
    if (selectedExpense && selectedExpense._doc.category) {
      handleCategoryChange(selectedExpense._doc.category);
    }
  }, [selectedExpense]);

  const handleUpdate = (index) => {
    setSelectedExpense(editableExpenses[index]);
    setFormVisible(true);
  };

  const handleFormSubmit = (values) => {
    const expenseDate = selectedExpense?._doc?.date;
    const userId = localStorage.getItem("UserId");

    if (!expenseDate || !selectedExpense?._doc?._id) {
      message.error("Expense data is missing or invalid.");
      return;
    }

    const updatedValues = {
      ...values,
      expenseId: selectedExpense._doc._id, // Send expenseId to identify the expense
    };

    client
      .put(`/expenses/updateExpense/${userId}/${expenseDate}`, updatedValues)
      .then((response) => {
        message.success("Expense updated successfully!");

        const updatedExpense = { ...selectedExpense, _doc: { ...selectedExpense._doc, ...updatedValues } };

        // Update the list with the modified expense
        const updatedExpensesList = editableExpenses.map((expense) =>
          expense._doc._id === selectedExpense._doc._id ? updatedExpense : expense
        );

        setEditableExpenses(updatedExpensesList);
        setFormVisible(false);

        onUpdate(updatedExpensesList);
      })
      .catch((error) => {
        message.error("Error updating expense.");
        console.error(error);
      });
  };

  return (
    <Modal
      title="Edit Expenses"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: '800px' }}
    >
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={editableExpenses}
        renderItem={(expense, index) => (
          <List.Item>
            <Card hoverable style={{ borderRadius: '8px', padding: '16px' }}>
              <Row gutter={[16, 16]} style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Col>
                  <p><strong>Date:</strong> {moment(expense._doc.date).format("DD-MM-YYYY")}</p>
                  <p><strong>Mode:</strong> {expense._doc.mode}</p>
                </Col>
                <Col>
                  <p><strong>Amount:</strong> ₹{expense._doc.amount}</p>
                  <p><strong>Category:</strong> {expense._doc.category}</p>
                </Col>
                <Col>
                  <p><strong>Subcategory:</strong> {expense._doc.subcategory}</p>
                  <p><strong>Description:</strong> {expense._doc.description}</p>
                </Col>
                <Col>
                  <Button onClick={() => handleUpdate(index)} type="primary">Edit</Button>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />

      {/* Popup Form for Editing Expense */}
      <Modal
        title="Edit Expense Details"
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '600px' }}
      >
        <Form
          initialValues={{
            mode: selectedExpense?._doc.mode,
            amount: selectedExpense?._doc.amount,
            category: selectedExpense?._doc.category,
            subcategory: selectedExpense?._doc.subcategory,
            description: selectedExpense?._doc.description,
          }}
          onFinish={handleFormSubmit}
        >
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
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select onChange={handleCategoryChange} style={{ width: '100%' }}>
              {categories.map((category) => (
                <Select.Option key={category} value={category}>{category}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Subcategory" name="subcategory" rules={[{ required: true }]}>
            <Select style={{ width: '100%' }}>
              {subcategoryOptions.map((subcategory) => (
                <Select.Option key={subcategory} value={subcategory}>{subcategory}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Update Expense</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );

};

export default EditExpenseModal;
