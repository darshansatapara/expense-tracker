import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ContentPage from '../components/MyContent';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const location = useLocation();
  useEffect(() => {
    const pathToPageName = {
      '/': 'Home',
      '/analysis': 'Analysis',
      '/history': 'History',
      '/settings': 'Settings',
    };
    setCurrentPage(pathToPageName[location.pathname] || 'Home');
  }, [location]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar handleDrawerToggle={handleDrawerToggle} currentPage={currentPage} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: '48px', sm: '48px' }, // Adjust to match the navbar height
          ml: { sm: '240px' }, // Sidebar width for larger screens
        }}
      >
        <ContentPage />
      </Box>
    </Box>
  );
}

export default Home;
