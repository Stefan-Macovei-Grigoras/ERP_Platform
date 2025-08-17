// components/factory/ProductSelection.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Avatar,
  Alert,
  Skeleton
} from '@mui/material';
import {
  AccessTime,
  LocalDining,
  PlayArrow,
  Assignment,
  Refresh,
  PlayCircle
} from '@mui/icons-material';

// Import API service
import factoryApiService from '../../services/factory/factoryApiService';

function ProductSelection({ onProductSelect }) {
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableBatches();
  }, []);

  const fetchAvailableBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const batches = await factoryApiService.getAvailableBatches();
      console.log('Fetched batches from API:', batches);
      
      setAvailableBatches(batches);
    } catch (err) {
      console.error('Failed to fetch available batches:', err);
      setError('Failed to load available batches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeProduction = (batch) => {
    console.log('handleResumeProduction called with batch:', batch);
    
    // Validate batch data before passing
    if (!batch || !batch.id) {
      console.error('Invalid batch data:', batch);
      alert('Invalid batch selected. Please try again.');
      return;
    }
    
    if (!batch.Product?.Recipe) {
      console.error('Batch has no recipe:', batch);
      alert('This batch has no recipe defined.');
      return;
    }
    
    onProductSelect(batch); // Use the same handler for now
  };

  const handleStartProduction = (batch) => {
    console.log('handleStartProduction called with batch:', batch);
    
    // Validate batch data before passing
    if (!batch || !batch.id) {
      console.error('Invalid batch data:', batch);
      alert('Invalid batch selected. Please try again.');
      return;
    }
    
    if (!batch.Product?.Recipe) {
      console.error('Batch has no recipe:', batch);
      alert('This batch has no recipe defined.');
      return;
    }
    
    onProductSelect(batch);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) { // Less than 24 hours
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    } else { // 24 hours or more
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      
      let result = `${days}d`;
      if (remainingHours > 0) result += ` ${remainingHours}h`;
      
      return result;
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Available Batches for Production
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box>
                      <Skeleton variant="text" width={120} height={24} />
                      <Skeleton variant="text" width={80} height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={100} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxHeight: 'calc(100vh - 30px)', 
      overflow: 'auto', 
      p: 2 
    }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center', maxHeight: 50 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" fontWeight="bold">
                Available Batches for Production: 
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {availableBatches.length}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={fetchAvailableBatches}
              disabled={loading}
            >
              Refresh List
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Batches Grid */}
      <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto', pr: 1, p: 2 }}>
        <Grid container spacing={3} justifyContent="center">
          {availableBatches.length > 0 ? (
            availableBatches.map((batch) => (
              <Grid item xs={12} md={availableBatches.length === 1 ? 12 : 6} key={batch.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    //height: '100%', 
                    height: 320,
                    width: '100%',
                    maxWidth: 350,
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Batch Header */}
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: '#2e7d32', width: 48, height: 48 }}>
                        <LocalDining />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {batch.Product?.name || 'Unknown Product'}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          Batch ID: {batch.id}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Recipe: {batch.Product?.Recipe?.name || 'No recipe'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Production Details */}
                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip 
                        label={`Yield: ${batch.Product?.Recipe?.yield || 'N/A'}kg`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Chip 
                        label={formatDuration(batch.Product?.Recipe?.totalTime || 0)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        icon={<AccessTime />}
                      />
                      <Chip 
                        label={batch.stage}
                        size="small"
                        color="warning"
                      />
                    </Box>

                    {/* Steps Count */}
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Assignment fontSize="small" color="disabled" />
                      <Typography variant="body2" color="textSecondary">
                        {batch.Product?.Recipe?.steps?.steps?.length || 0} production steps
                      </Typography>
                    </Box>

                    {/* First Few Steps Preview */}
                    <Typography variant="body2" color="textSecondary">
                      Steps: {batch.Product?.Recipe?.steps?.steps?.slice(0, 3).map(step => step.name).join(', ')}
                      {batch.Product?.Recipe?.steps?.steps?.length > 3 && '...'}
                    </Typography>

                    {/* Created date */}
                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                      Created: {new Date(batch.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ mt: 'auto' }}>
                    {batch.stage === 'start-processing' ? (
                      <Button 
                        variant="contained"
                        startIcon={<PlayCircle/>}
                        fullWidth
                        onClick={() => handleResumeProduction(batch)}
                        sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                      >
                        Continue Production
                      </Button>
                    ) : (
                      <Button 
                        variant="contained"
                        startIcon={<PlayArrow />}
                        fullWidth
                        onClick={() => handleStartProduction(batch)}
                        sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                      >
                        Start Production
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <LocalDining sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" mb={1}>
                  No Batches Available
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  There are currently no batches ready for production.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default ProductSelection;