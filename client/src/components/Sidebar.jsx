import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const drawerWidth = 240; // Width of the sidebar
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Analysis', path: '/analysis' },
    { text: 'History', path: '/history' },
    { text: 'Settings', path: '/settings' }
  ];

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemText primary={item.text} />
          </ListItem>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              top: '48px', // Adjusted to the height of the navbar
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
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              top: '48px', // Adjusted to the height of the navbar
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
