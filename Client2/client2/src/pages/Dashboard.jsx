import { Box, Typography, Grid, Paper } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">42</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Orders in Progress</Typography>
            <Typography variant="h4">5</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Low Stock Alerts</Typography>
            <Typography variant="h4">3</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">8</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
