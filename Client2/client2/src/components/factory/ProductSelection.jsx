// // components/factory/ProductSelection.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Grid,
//   Chip,
//   Avatar,
//   Alert,
//   Skeleton
// } from '@mui/material';
// import {
//   AccessTime,
//   LocalDining,
//   PlayArrow,
//   Assignment
// } from '@mui/icons-material';

// // Mock API service - replace with your actual API
// import factoryApiService from '../../services/factory/factoryApiService';

// function ProductSelection({ onProductSelect }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchAvailableProducts();
//   }, []);

//   const fetchAvailableProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Fetch products that are due for production
//       const data = await factoryApiService.getAvailableProducts();
//       setProducts(data);
//     } catch (err) {
//       console.error('Failed to fetch products:', err);
//       setError('Failed to load available products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartProduction = (product) => {
//     onProductSelect(product);
//   };

//   const formatDuration = (minutes) => {
//     if (minutes < 60) return `${minutes}min`;
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;
//     return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
//   };

//   if (loading) {
//     return (
//       <Box>
//         <Typography variant="h5" fontWeight="bold" mb={3}>
//           Select Product to Start Production
//         </Typography>
//         <Grid container spacing={3}>
//           {Array.from({ length: 4 }).map((_, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" gap={2} mb={2}>
//                     <Skeleton variant="circular" width={48} height={48} />
//                     <Box>
//                       <Skeleton variant="text" width={120} height={24} />
//                       <Skeleton variant="text" width={80} height={20} />
//                     </Box>
//                   </Box>
//                   <Skeleton variant="text" width="100%" height={20} />
//                   <Skeleton variant="text" width="60%" height={20} />
//                 </CardContent>
//                 <CardActions>
//                   <Skeleton variant="rectangular" width={100} height={36} />
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Page Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h5" fontWeight="bold">
//             Select Product to Start Production
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Choose a product from the production queue
//           </Typography>
//         </Box>
//         <Button variant="outlined" onClick={fetchAvailableProducts}>
//           Refresh
//         </Button>
//       </Box>

//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Products Grid */}
//       <Grid container spacing={3}>
//         {products.length > 0 ? (
//           products.map((product) => (
//             <Grid item xs={12} sm={6} md={4} key={product.id}>
//               <Card 
//                 elevation={2} 
//                 sx={{ 
//                   height: '100%', 
//                   display: 'flex', 
//                   flexDirection: 'column',
//                   '&:hover': {
//                     elevation: 4,
//                     transform: 'translateY(-2px)',
//                     transition: 'all 0.3s ease'
//                   }
//                 }}
//               >
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   {/* Product Header */}
//                   <Box display="flex" alignItems="center" gap={2} mb={2}>
//                     <Avatar sx={{ bgcolor: '#2e7d32', width: 48, height: 48 }}>
//                       <LocalDining />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h6" fontWeight="bold">
//                         {product.Product?.name || 'Unknown Product'}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         Recipe: {product.name}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   {/* Production Details */}
//                   <Box display="flex" gap={1} mb={2}>
//                     <Chip 
//                       label={`Yield: ${product.yield}kg`}
//                       size="small"
//                       variant="outlined"
//                       color="primary"
//                     />
//                     <Chip 
//                       label={formatDuration(product.totalTime)}
//                       size="small"
//                       variant="outlined"
//                       color="secondary"
//                       icon={<AccessTime />}
//                     />
//                   </Box>

//                   {/* Steps Count */}
//                   <Box display="flex" alignItems="center" gap={1} mb={2}>
//                     <Assignment fontSize="small" color="disabled" />
//                     <Typography variant="body2" color="textSecondary">
//                       {product.steps?.steps?.length || 0} production steps
//                     </Typography>
//                   </Box>

//                   {/* First Few Steps Preview */}
//                   <Typography variant="body2" color="textSecondary">
//                     Steps: {product.steps?.steps?.slice(0, 3).map(step => step.name).join(', ')}
//                     {product.steps?.steps?.length > 3 && '...'}
//                   </Typography>
//                 </CardContent>

//                 <CardActions>
//                   <Button 
//                     variant="contained"
//                     startIcon={<PlayArrow />}
//                     fullWidth
//                     onClick={() => handleStartProduction(product)}
//                     sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
//                   >
//                     Start Production
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))
//         ) : (
//           <Grid item xs={12}>
//             <Paper sx={{ p: 4, textAlign: 'center' }}>
//               <LocalDining sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
//               <Typography variant="h6" color="textSecondary" mb={1}>
//                 No Products Available
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 There are currently no products scheduled for production.
//               </Typography>
//               <Button 
//                 variant="outlined" 
//                 sx={{ mt: 2 }}
//                 onClick={fetchAvailableProducts}
//               >
//                 Refresh List
//               </Button>
//             </Paper>
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   );
// }

// export default ProductSelection;

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
  PlayArrow,
  LocalDining,
  Assignment
} from '@mui/icons-material';

// Simple API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function ProductSelection({ onBatchSelect }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDueBatches();
  }, []);

  const fetchDueBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch batches with stage "due"
      const response = await fetch(`${API_BASE_URL}/batches`);
      const data = await response.json();
      
      // Filter only "due" batches
      const dueBatches = data.filter(batch => batch.stage === 'due');
      setBatches(dueBatches);
    } catch (err) {
      console.error('Failed to fetch batches:', err);
      setError('Failed to load due batches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBatch = async (batch) => {
    try {
      // Update batch stage to "in-progress"
      await fetch(`${API_BASE_URL}/batches/${batch.id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'in-progress' })
      });

      onBatchSelect(batch);
    } catch (err) {
      console.error('Failed to start batch:', err);
      setError('Failed to start batch. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Select Batch to Start Production
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
    <Box>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Select Batch to Start Production
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Choose a batch from the due production queue
          </Typography>
        </Box>
        <Button variant="outlined" onClick={fetchDueBatches}>
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Batches Grid */}
      <Grid container spacing={3}>
        {batches.length > 0 ? (
          batches.map((batch) => (
            <Grid item xs={12} sm={6} md={4} key={batch.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
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
                      <Typography variant="caption" color="textSecondary">
                        Batch ID: {batch.id}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Batch Details */}
                  <Box display="flex" gap={1} mb={2}>
                    <Chip 
                      label={batch.stage}
                      size="small"
                      variant="outlined"
                      color="warning"
                    />
                  </Box>

                  {/* Created Date */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Assignment fontSize="small" color="disabled" />
                    <Typography variant="body2" color="textSecondary">
                      Created: {new Date(batch.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button 
                    variant="contained"
                    startIcon={<PlayArrow />}
                    fullWidth
                    onClick={() => handleStartBatch(batch)}
                    sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                  >
                    Start Production
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <LocalDining sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" mb={1}>
                No Batches Due
              </Typography>
              <Typography variant="body2" color="textSecondary">
                There are currently no batches scheduled for production.
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={fetchDueBatches}
              >
                Refresh List
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ProductSelection;