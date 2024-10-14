import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Rate,
  Modal,
  Dropdown,
  Menu,
} from "antd";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { DownOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function VisitorPage() {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Optionally show a message or button to prompt user to rate
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleRateUsClick = () => {
    setShowRatingModal(true);
  };

  const handleRatingChange = (value) => {
    setRatingValue(value);
  };

  const handleSubmitRating = () => {
    alert(`Thank you for your rating of ${ratingValue} stars!`);
    setShowRatingModal(false);
    setRatingValue(0);
  };

  const handleModalCancel = () => {
    setShowRatingModal(false);
    setRatingValue(0);
  };

  const menu = (
    <Menu>
      <Menu.Item key="signin" onClick={handleSignInClick}>
        Sign In
      </Menu.Item>
      <Menu.Item key="signup" onClick={handleSignUpClick}>
        Sign Up
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ borderRadius: "10px", padding: 0 }}>
      <Header
        style={{
          backgroundColor: "#001529",
          display: "flex",
          justifyContent: "space-Between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
          padding: "0 20px",
        }}
      >
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          Expense Tracker
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="default" style={{ marginRight: "10px" }}>
              sign up/in <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Content style={{ textAlign: "center" }}>
        <Row justify="center" style={{ marginTop: "30px", padding: "0 10px" }}>
          <Col
            xs={24}
            md={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src="https://www.shutterstock.com/image-photo/plant-growing-out-gold-coins-260nw-125086439.jpg"
              alt="Expense Management"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "300px",
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />
          </Col>
          <Col
            xs={24}
            md={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Title level={2}>Manage Your Daily Expenses Efficiently</Title>
            <Paragraph>
              This app helps you keep track of your daily expenses with ease.
              Categorize your expenses, get detailed reports, and analyze your
              spending habits with our simple yet powerful tool. Stay on top of
              your financial health!
            </Paragraph>
          </Col>
        </Row>

        <Row
          justify="center"
          gutter={[16, 16]}
          style={{ marginTop: "50px", padding: "0 10px" }}
        >
          <Col xs={24} md={8}>
            <Title level={3}>Enrolled Users</Title>
            <CountUp
              end={200}
              duration={2}
              style={{ fontSize: "48px", fontWeight: "bold" }}
            />
            <Paragraph style={{ fontSize: "20px" }}>200+ Users</Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={3}>Feedback Users</Title>
            <CountUp
              end={500}
              duration={2}
              style={{ fontSize: "48px", fontWeight: "bold" }}
            />
            <Paragraph style={{ fontSize: "20px" }}>500+ Feedbacks</Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={3}>Good Response</Title>
            <CountUp
              end={300}
              duration={2}
              style={{ fontSize: "48px", fontWeight: "bold" }}
            />
            <Paragraph style={{ fontSize: "20px" }}>
              300+ Positive Responses
            </Paragraph>
          </Col>
        </Row>

        <Row
          justify="center"
          gutter={[16, 16]}
          style={{ marginTop: "30px", padding: "0 10px" }}
        >
          <Col>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#001529", borderColor: "#001529" }}
              onClick={handleRateUsClick}
            >
              Rate Us
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#001529", borderColor: "#001529" }}
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </Col>
        </Row>

        <Modal
          title="Rate Us"
          visible={showRatingModal}
          onOk={handleSubmitRating}
          onCancel={handleModalCancel}
          footer={[
            <Button key="back" onClick={handleModalCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmitRating}>
              Submit Rating
            </Button>,
          ]}
        >
          <Rate onChange={handleRatingChange} value={ratingValue} />
        </Modal>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Expense Tracker ©2024 Created by Your Name
      </Footer>
    </Layout>
  );
}
