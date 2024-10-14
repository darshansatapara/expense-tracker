import React, { useState } from "react";
import { Container, TextField, Button, Alert, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom"; // Import the useNavigate hook
import client from "../axios";

export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false); // State to manage button click feedback

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message);
        setResponseType("success");
        setTimeout(() => navigate("/"), 1000); 
        localStorage.setItem("UserMail", result.user.email)
        localStorage.setItem("UserId", result.user._id);
      } else {
        setResponseMessage(result.message);
        setResponseType("error");
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
      setResponseType("error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFFFFF" }}>
      {/* Background color updated */}
      {/* Response message positioned at the top */}
      {responseMessage && (
        <Alert severity={responseType} style={{ marginBottom: "20px" }}>
          {responseMessage}
        </Alert>
      )}
      <Container
        maxWidth="sm"
        style={{
          backgroundColor: "#eeeeff", // Container color updated
          padding: "30px",
          borderRadius: "10px",
          marginTop: "20px",
          boxShadow: "1px 25px 50px rgba(0.3, 0, 0.3, 0.5)",
          "@media (max-width: 600px)": {
            padding: "20px",
            marginTop: "10px",
          },
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Expansify - Sign In
        </Typography>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            type="email"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            type="password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              backgroundColor: "#007bff",
              "@media (max-width: 600px)": {
                marginTop: "10px",
              },
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* New content: Sign-up prompt */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <span>If you don't Have an account?</span>
          <Link
            to="/signup"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </div>
      </Container>
    </div>
  );
}
