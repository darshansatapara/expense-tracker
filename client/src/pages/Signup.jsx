import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    mobile_no: "+91", // Default value set to "+91"
    date_of_birth: "",
    category: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false); // State to manage button click feedback

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure that only 10 digits can be entered after the default value of "+91"
    if (name === "mobile_no" && !/^\+91\d{0,10}$/.test(value)) {
      return; // If input doesn't match, return without changing the state
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation: at least one special character and minimum length of 6
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (formData.password.length < 6) {
      setResponseMessage("Password must be at least 6 characters long.");
      setResponseType("error");
      return;
    }

    if (!specialCharPattern.test(formData.password)) {
      setResponseMessage(
        "Password must contain at least one special character."
      );
      setResponseType("error");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch("api/users/signup", {
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
        setTimeout(() => navigate("/home"), 1000); // Navigate to home page after 2 seconds
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

  const handleClear = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      name: "",
      mobile_no: "+91",
      date_of_birth: "",
      category: "",
    });
    setResponseMessage("");
    setResponseType("");
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFFFFF" }}>
      {" "}
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
          boxShadow: "1px 25px 50px rgba(0.3, 0, 0.3, 0.5)", // Box shadow added
          "@media (max-width: 600px)": {
            padding: "20px",
            marginTop: "10px",
          },
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Expansify - Sign Up
        </Typography>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />

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
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 13 }} // Limits the maximum length to 13 characters
          />

          <TextField
            fullWidth
            label="Date of Birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            margin="normal"
            required
            type="date"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="householder">Householder</MenuItem>
          </TextField>

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
            disabled={loading} // Disable button when loading
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>

          <Button
            onClick={handleClear}
            fullWidth
            variant="outlined"
            color="secondary"
            style={{
              marginTop: "10px",
              "@media (max-width: 600px)": {
                marginTop: "5px",
              },
            }}
          >
            Clear Form
          </Button>
        </form>
      </Container>
    </div>
  );
}
