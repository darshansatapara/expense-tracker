import React from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useSignupContext } from "../utils/SignupContext"; // Import the custom hook
import client from "../axios";

export default function Signup() {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    responseMessage,
    responseType,
    loading,
    setLoading,
    handleChange,
    handleClear,
    setResponseMessage,
    setResponseType,
  } = useSignupContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setLoading(true);

    try {
      const response = await fetch("/api/users/signup", {
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
        navigate("/signup/question1");
        localStorage.setItem("UserMail", result.user.email);
        localStorage.setItem("UserId", result.user._id); //for store the category and sucategories in the data base
      } else {
        setResponseMessage(result.message);
        setResponseType("error");
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
      setResponseType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFFFFF" }}>
      {responseMessage && (
        <Alert severity={responseType} style={{ marginBottom: "20px" }}>
          {responseMessage}
        </Alert>
      )}
      <Container
        maxWidth="sm"
        style={{
          backgroundColor: "#eeeeff",
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
          Sign Up
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
            inputProps={{ maxLength: 13 }}
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
            label="Proffesion"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="housewife">House Wife</MenuItem>
            <MenuItem value="businessmen">Businessmen</MenuItem>
            <MenuItem value="retired">Retired/Elder</MenuItem>
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
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up and Next"}
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
                marginBottom: "10px",
              },
            }}
          >
            Clear Form
          </Button>
          <span> Have an account?</span>
          <Link
            to="/signin"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </form>
      </Container>
    </div>
  );
}
