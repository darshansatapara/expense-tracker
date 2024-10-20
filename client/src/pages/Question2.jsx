import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import categories from "../utils/categories.js"; // Import the categories data

function Question2() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.selectedCategories) {
      setSelectedCategories(location.state.selectedCategories);
    }
  }, [location.state]);

  const handleSubcategoryChange = (category, subcategory) => {
    setSelectedSubcategories((prev) => {
      const selectedSubs = prev[category] || [];
      if (selectedSubs.includes(subcategory)) {
        return {
          ...prev,
          [category]: selectedSubs.filter((s) => s !== subcategory),
        };
      } else {
        return {
          ...prev,
          [category]: [...selectedSubs, subcategory],
        };
      }
    });
  };

  const handleNext = async () => {
    let valid = true;

    selectedCategories.forEach((category) => {
      if (
        !selectedSubcategories[category] ||
        selectedSubcategories[category].length < 2
      ) {
        valid = false;
        setError("Please select at least 2 subcategories for each category.");
      }
    });

    if (valid) {
      const email = localStorage.getItem("UserMail"); // Retrieve email from localStorage

      if (!email) {
        setError("Email is not available. Please log in again.");
        return;
      }

      try {
        const response = await axios.post(
          `/api/categories/create/${email}`,
          {
            categoriesData: selectedSubcategories,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Data saved:", response.data);
        navigate("/home"); // Or to the next page
      } catch (error) {
        // Handle the error
        setError(error.response ? error.response.data : error.message);
      }
    }
  };

  const categoriesToDisplay = selectedCategories.map((category) => ({
    category,
    subcategories: categories[category],
  }));

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Select subcategories for your chosen categories
      </Typography>
      {categoriesToDisplay.length === 0 ? (
        <Alert severity="info">No categories selected</Alert>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <FormControl component="fieldset">
            <FormGroup>
              {categoriesToDisplay.map(({ category, subcategories }) => (
                <Box key={category} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {category}
                  </Typography>
                  <Grid container spacing={2}>
                    {subcategories.map((subcategory) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={subcategory}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                selectedSubcategories[category]?.includes(
                                  subcategory
                                ) || false
                              }
                              onChange={() =>
                                handleSubcategoryChange(category, subcategory)
                              }
                              color="primary"
                            />
                          }
                          label={subcategory}
                          sx={{ display: "flex", alignItems: "center" }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </FormGroup>
          </FormControl>
        </Paper>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Finish
        </Button>
      </Box>
    </Container>
  );
}

export default Question2;
