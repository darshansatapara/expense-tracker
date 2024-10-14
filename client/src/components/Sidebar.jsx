import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../css/Sidebar.css"
const Sidebar = () => {
  const drawerWidth = 240; // Width of the sidebar
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { text: "Home", path: "/home" },
    { text: "History", path: "/history" },
    { text: "Analysis", path: "/analysis" },
    { text: "Setting", path: "/setting" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            component={Link}
            to={item.path}
            key={item.text}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              top: "48px", // Adjusted to the height of the navbar
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              top: "48px", // Adjusted to the height of the navbar
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
