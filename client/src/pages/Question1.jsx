import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import categories from "../utils/categories.js"; // Import the categories data

function Question1() {
  const categoryNames = Object.keys(categories);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    // Clear error message when user makes changes
    if (error) {
      setError("");
    }
  };

  useEffect(() => {
    console.log("id", localStorage.getItem("userId"));
  });
  const handleNext = () => {
    if (selectedCategories.length < 3) {
      setError("Please select at least 3 categories to proceed.");
    } else {
      navigate("/signup/question2", {
        state: { selectedCategories }, // Pass the selected categories to Question2
      });
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Add to the category by selecting the one or more in which your expenses
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <FormControl component="fieldset">
          <FormGroup>
            <Grid container spacing={2}>
              {categoryNames.map((category) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCheckboxChange(category)}
                        color="primary"
                      />
                    }
                    label={category}
                    sx={{ display: "flex", alignItems: "center" }}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </FormControl>
      </Paper>
      <Box
        sx={{
          mt: 3,
          mb: 2,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="body1" gutterBottom>
          Selected categories:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {selectedCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              onDelete={() => handleCheckboxChange(category)}
              color="primary"
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" color="secondary" onClick={handleSkip}>
          Skip
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Container>
  );
}

export default Question1;
