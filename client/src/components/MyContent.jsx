import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, IconButton, Modal, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ContentPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* First Grid Item: Cash Payment */}
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            Cash Payment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Income
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Outcome
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Second Grid Item: Online Payment */}
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            Online Payment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Income
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Outcome
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Third Grid Item: Last Day Expense */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="div">
                Last Day Expense
              </Typography>
              <Box>
                <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>
                  $120.00 {/* Example amount */}
                </Typography>
                <IconButton aria-label="edit" color="primary">
                  <EditIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Fourth Grid Item: Total Amount of Last Month */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Amount of Last Month
              </Typography>
              <Typography variant="body1" color="textSecondary">
                $5000.00 {/* Example amount */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Fifth Grid Item: Total Amount of Last Year */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Amount of Last Year
              </Typography>
              <Typography variant="body1" color="textSecondary">
                $60000.00 {/* Example amount */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Input */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Add Expense
          </Typography>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amount"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseModal}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ContentPage;
