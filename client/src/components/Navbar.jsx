import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle"; // Import AccountCircle icon
import { useLocation, useNavigate } from "react-router-dom"; // Updated import

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const [isSignedIn, setIsSignedIn] = useState(false); // State to track if user is signed in
  const navigate = useNavigate(); // Hook to navigate between routes
  const [currentPage, setCurrentPage] = useState("Home");

  useEffect(() => {
    const userEmail = localStorage.getItem("UserMail"); // Check if user email exists in localStorage
    setIsSignedIn(!!userEmail); // If email exists, user is signed in
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const location = useLocation();
  useEffect(() => {
    const pathToPageName = {
      "/": "Home",
      "/analysis": "Analysis",
      "/history": "History",
      "/setting": "Setting",
    };
    setCurrentPage(pathToPageName[location.pathname] || "Home");
  }, [location]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    navigate("/signin"); // Navigate to the sign-in page
    handleMenuClose();
  };

  const handleSignUp = () => {
    navigate("/signup"); // Navigate to the sign-up page
    handleMenuClose();
  };

  const handleSignOut = () => {
    localStorage.removeItem("UserMail"); // Remove user email from localStorage
    setIsSignedIn(false); // Update signed-in state
    handleMenuClose();
    navigate("/"); // Redirect to home page after sign out
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: "48px", // Reduced height
      }}
    >
      <Toolbar
        sx={{
          minHeight: "48px", // Adjust Toolbar height
          display: "flex",
          justifyContent: "space-between", // Space between items
          alignItems: "center", // Align items vertically center
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            flexGrow: 1, // Allow the Typography to center
            display: "flex",
            justifyContent: "center", // Center the Typography horizontally
          }}
        >
          <Typography variant="h6" noWrap component="div">
            {currentPage}
          </Typography>
        </Box>
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          color="inherit"
        >
          <AccountCircle /> {/* Profile icon */}
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isSignedIn ? (
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          ) : (
            [
              <MenuItem key="sign-in" onClick={handleSignIn}>
                Sign In
              </MenuItem>,
              <MenuItem key="sign-up" onClick={handleSignUp}>
                Sign Up
              </MenuItem>,
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
