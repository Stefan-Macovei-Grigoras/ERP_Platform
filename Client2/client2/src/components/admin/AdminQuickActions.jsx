import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider
} from '@mui/material';
import {
  PersonAdd,
  Add,
  Inventory,
  LocalDining,
  Schedule,
  NotificationImportant
} from '@mui/icons-material';

function AdminQuickActions({ onPageChange }) {
  
  // Debug log to verify prop is received
  console.log('AdminQuickActions - onPageChange prop:', typeof onPageChange);
  
  // Handle quick action clicks
  const handleAction = (action) => {
    console.log('handleAction called with:', action); // Debug log
    
    // Add null check for onPageChange
    if (!onPageChange) {
      console.error('onPageChange function not provided to AdminQuickActions');
      return;
    }

    switch (action) {
      case 'add-user':
        console.log('Calling onPageChange with: users'); // Debug log
        onPageChange('users');
        break;
      case 'create-batch':
        console.log('Open create batch dialog');
        break;
      case 'add-product':
        console.log('Calling onPageChange with: products'); // Debug log
        onPageChange('products');
        break;
      case 'check-inventory':
        console.log('Calling onPageChange with: inventory'); // Debug log
        onPageChange('inventory');
        break;
      case 'view-alerts':
        console.log('Open alerts panel');
        break;
      case 'backup-system':
        console.log('Start system backup');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Quick Actions Panel */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          {/* Primary Actions */}
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              startIcon={<PersonAdd />} 
              fullWidth
              onClick={() => handleAction('add-user')}
              sx={{ mb: 1 }}
            >
              Add New User
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              startIcon={<Schedule />} 
              fullWidth
              color="success"
              onClick={() => handleAction('create-batch')}
            >
              Create New Batch
            </Button>
          </Grid>
          
          {/* Secondary Actions */}
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              startIcon={<LocalDining />} 
              fullWidth
              size="small"
              onClick={() => handleAction('add-product')}
            >
              Add Product
            </Button>
          </Grid>
          
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              startIcon={<Inventory />} 
              fullWidth
              size="small"
              onClick={() => handleAction('check-inventory')}
            >
              Check Stock
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default AdminQuickActions;