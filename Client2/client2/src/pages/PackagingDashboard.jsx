// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Button,
//   Badge,
//   Skeleton,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Alert,
//   Chip
// } from '@mui/material';
// import {
//   Refresh,
//   MoreVert,
//   PlayArrow,
//   CheckCircle,
//   LocalShipping,
//   Assignment
// } from '@mui/icons-material';
// import adminApiService from '.././services/admin/adminApiService';

// function PackagingRowSkeleton() {
//   return (
//     <TableRow>
//       <TableCell><Skeleton variant="text" /></TableCell>
//       <TableCell><Skeleton variant="text" /></TableCell>
//       <TableCell><Skeleton variant="text" /></TableCell>
//       <TableCell><Skeleton variant="text" /></TableCell>
//       <TableCell align="right"><Skeleton variant="rectangular" width={60} height={24} /></TableCell>
//     </TableRow>
//   );
// }

// function PackagingDashboard() {
//   const [batches, setBatches] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedBatch, setSelectedBatch] = useState(null);

//   useEffect(() => {
//     fetchBatches();
//     fetchProducts();
//   }, []);

//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await adminApiService.getBatches();
      
//       // Filter batches for packaging workflow: 'end-processing' and 'packaging' stages
//       const packagingBatches = data.filter(batch => 
//         batch.stage === 'end-processing' || batch.stage === 'packaging'
//       );
      
//       console.log('All batches:', data);
//       console.log('Packaging batches:', packagingBatches);
      
//       setBatches(packagingBatches);
//     } catch (err) {
//       console.error('Failed to fetch batches:', err);
//       setError('Failed to load batches. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const data = await adminApiService.getProducts();
//       setProducts(data);
//     } catch (err) {
//       console.error('Failed to fetch products:', err);
//     }
//   };

//   // Get product name by ID
//   const getProductName = (productId) => {
//     const product = products.find(p => p.id === productId);
//     return product ? product.name : `Product #${productId}`;
//   };

//   // Stage color mapping
//   const getStageColor = (stage) => {
//     switch (stage?.toLowerCase()) {
//       case 'end-processing':
//         return 'warning';
//       case 'packaging':
//         return 'info';
//       case 'done':
//         return 'success';
//       default:
//         return 'default';
//     }
//   };

//   // Stage display name
//   const getStageDisplayName = (stage) => {
//     switch (stage) {
//       case 'end-processing':
//         return 'Ready for Packaging';
//       case 'packaging':
//         return 'Packaging in Progress';
//       case 'done':
//         return 'Completed';
//       default:
//         return stage;
//     }
//   };

//   // Handle action menu
//   const handleMenuClick = (event, batch) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedBatch(batch);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedBatch(null);
//   };

//   // Handle batch actions
//   const handleBatchAction = async (action) => {
//     try {
//       setError(null);
      
//       switch (action) {
//         case 'start_packaging':
//           // Move from 'end-processing' to 'packaging'
//           await adminApiService.updateBatch(selectedBatch.id, { stage: 'packaging' });
//           console.log(`Started packaging for batch ${selectedBatch.id}`);
//           break;
//         case 'finish_packaging':
//           // Move from 'packaging' to 'done'
//            await adminApiService.updateBatch(selectedBatch.id, { stage: 'done' });
//           console.log(`Completed packaging for batch ${selectedBatch.id}`);
//           break;
//         default:
//           break;
//       }
      
//       // Refresh data after action
//       await fetchBatches();
      
//     } catch (err) {
//       console.error('Failed to execute batch action:', err);
//       setError(`Failed to execute action: ${err.message}`);
//     }
    
//     handleMenuClose();
//   };

//   // Get available actions based on batch stage
//   const getAvailableActions = (batch) => {
//     const actions = [];
    
//     switch (batch.stage) {
//       case 'end-processing':
//         actions.push({
//           icon: <LocalShipping />,
//           label: 'Start Packaging',
//           action: 'start_packaging'
//         });
//         break;
//       case 'packaging':
//         actions.push({
//           icon: <CheckCircle />,
//           label: 'Finish Packaging',
//           action: 'finish_packaging'
//         });
//         break;
//     }
    
//     return actions;
//   };

//   const handleRefresh = () => {
//     fetchBatches();
//   };

//   // Count batches by stage
//   const readyForPackagingCount = batches.filter(b => b.stage === 'end-processing').length;
//   const packagingInProgressCount = batches.filter(b => b.stage === 'packaging').length;

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Page Header */}
//       <Box mb={3}>
//         <Typography variant="h4" fontWeight="bold">
//           Packaging Dashboard
//         </Typography>
//         <Typography variant="body1" color="textSecondary">
//           Manage batch packaging operations
//         </Typography>
//       </Box>

//       {/* Quick Stats */}
//       <Box display="flex" gap={2} mb={3}>
//         <Chip 
//           label={`${readyForPackagingCount} Ready for Packaging`} 
//           color="warning" 
//           variant="outlined"
//           icon={<Assignment />}
//         />
//         <Chip 
//           label={`${packagingInProgressCount} Currently Packaging`} 
//           color="info" 
//           variant="outlined"
//           icon={<LocalShipping />}
//         />
//       </Box>

//       {/* Batches Table */}
//       <Paper elevation={2}>
//         <Box 
//           display="flex" 
//           justifyContent="space-between" 
//           alignItems="center" 
//           sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Box>
//             <Typography variant="h6" fontWeight="bold">
//               Packaging Queue
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {batches.length} batches in packaging workflow
//             </Typography>
//           </Box>
//           <IconButton onClick={handleRefresh} disabled={loading}>
//             <Refresh />
//           </IconButton>
//         </Box>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Batch ID</TableCell>
//                 <TableCell>Product</TableCell>
//                 <TableCell>Stage</TableCell>
//                 <TableCell>Processing Completed</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 // Show skeleton rows while loading
//                 Array.from({ length: 5 }).map((_, index) => (
//                   <PackagingRowSkeleton key={index} />
//                 ))
//               ) : batches.length > 0 ? (
//                 // Show actual batch data
//                 batches.map((batch) => (
//                   <TableRow key={batch.id} hover>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="medium">
//                         #{batch.id}
//                       </Typography>
//                     </TableCell>
                    
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="medium">
//                         {batch.Product?.name || getProductName(batch.productId)}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         ID: {batch.productId}
//                       </Typography>
//                     </TableCell>
                    
//                     <TableCell>
//                       <Badge
//                         color={getStageColor(batch.stage)}
//                         variant="dot"
//                         sx={{ mr: 1 }}
//                       />
//                       <Typography variant="body2">
//                         {getStageDisplayName(batch.stage)}
//                       </Typography>
//                     </TableCell>
                    
//                     <TableCell>
//                       <Typography variant="body2">
//                         {batch.processingCompletedAt 
//                           ? new Date(batch.processingCompletedAt).toLocaleDateString()
//                           : batch.finishedAt 
//                           ? new Date(batch.finishedAt).toLocaleDateString()
//                           : new Date(batch.createdAt).toLocaleDateString()
//                         }
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         {batch.processingCompletedAt 
//                           ? new Date(batch.processingCompletedAt).toLocaleTimeString()
//                           : batch.finishedAt 
//                           ? new Date(batch.finishedAt).toLocaleTimeString()
//                           : 'N/A'
//                         }
//                       </Typography>
//                     </TableCell>
                    
//                     <TableCell align="right">
//                       {getAvailableActions(batch).length > 0 ? (
//                         <IconButton 
//                           size="small"
//                           onClick={(e) => handleMenuClick(e, batch)}
//                         >
//                           <MoreVert />
//                         </IconButton>
//                       ) : (
//                         <Typography variant="caption" color="textSecondary">
//                           Complete
//                         </Typography>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 // Show empty state
//                 <TableRow>
//                   <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
//                     <Typography color="textSecondary">
//                       No batches ready for packaging
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                       Batches will appear here when production is completed (end-processing stage)
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Action Menu */}
//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={handleMenuClose}
//       >
//         {selectedBatch && getAvailableActions(selectedBatch).map((action, index) => (
//           <MenuItem 
//             key={index}
//             onClick={() => handleBatchAction(action.action)}
//           >
//             <ListItemIcon>{action.icon}</ListItemIcon>
//             <ListItemText 
//               primary={action.label}
//               secondary={
//                 action.action === 'start_packaging' 
//                   ? 'Move to packaging stage'
//                   : 'Complete and mark as done'
//               }
//             />
//           </MenuItem>
//         ))}
//       </Menu>
//     </Box>
//   );
// }

// export default PackagingDashboard;

import React, { useState } from 'react';
import { Box, Alert, Snackbar, Grid } from '@mui/material';

// Factory Components
import ProductSelection from './../components/factory/ProductSelection';
import ProductionSteps from './../components/factory/ProductionSteps';
import SensorDataDisplay from './../components/shared/SensorDataDisplay'

// API Service
import factoryApiService from '.././services/factory/factoryApiService';

function FactoryDashboard() {
  const [currentView, setCurrentView] = useState('selection'); // 'selection' or 'production'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Debug logging
  console.log('FactoryDashboard render - currentView:', currentView, 'selectedProduct:', selectedProduct);

  // Show notification
  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Handle product selection - this starts a new production session
  const handleProductSelect = (batch) => {
    console.log('Batch selected for production:', batch);
    setSelectedProduct(batch);
    setCurrentView('production');
    
    showNotification(
      `Production session started for ${batch.Product?.name} (Batch ID: ${batch.id})`, 
      'info'
    );
  };

  // Handle back to selection
  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedProduct(null);
  };

  // Handle production completion - processing stage finished
  const handleProductionComplete = async (productionData) => {
    console.log('Production processing completed:', productionData);
    
    try {
      // Show success notification with detailed info
      showNotification(
        `Production completed! Batch ${productionData.batchId} - ${productionData.yield}kg produced in ${productionData.totalDuration} minutes`, 
        'success'
      );

      // Log detailed completion summary
      const completionSummary = {
        batchId: productionData.batchId,
        recipeId: productionData.recipeId,
        productId: productionData.productId,
        stage: productionData.stage,
        totalDuration: productionData.totalDuration,
        stepsCompleted: productionData.completedSteps.length,
        yield: productionData.yield,
        completedAt: new Date().toISOString()
      };
      console.log('Production Summary:', completionSummary);

      // Auto-return to selection after showing completion state
      setTimeout(() => {
        handleBackToSelection();
        showNotification('Ready for next production batch', 'info');
      }, 4000);

    } catch (error) {
      console.error('Error handling production completion:', error);
      showNotification('Error completing production process', 'error');
    }
  };

  // Handle packaging start (if you want to add this functionality)
  const handleStartPackaging = async (batchId) => {
    try {
      await factoryApiService.startPackaging(batchId);
      showNotification(`Packaging started for Batch ${batchId}`, 'info');
    } catch (error) {
      console.error('Failed to start packaging:', error);
      showNotification('Failed to start packaging', 'error');
    }
  };

  // Handle final batch completion (if you want to add this functionality)
  const handleCompleteBatch = async (batchId, finalData = {}) => {
    try {
      await factoryApiService.completeBatch(batchId, finalData);
      showNotification(`Batch ${batchId} completed successfully!`, 'success');
    } catch (error) {
      console.error('Failed to complete batch:', error);
      showNotification('Failed to complete batch', 'error');
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={3}>
        {/* Left Column - Main Production Content */}
        <Grid item xs={12} lg={8}>
          {currentView === 'selection' ? (
            <ProductSelection onProductSelect={handleProductSelect} />
          ) : (
            <ProductionSteps 
              selectedBatch={selectedProduct}
              onBackToSelection={handleBackToSelection}
              onProductionComplete={handleProductionComplete}
            />
          )}
        </Grid>

        {/* Right Column - Sensor Data */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <SensorDataDisplay />
          </Box>
        </Grid>
      </Grid>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Development Helper - Show current state */}
      {process.env.NODE_ENV === 'development' && (
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            left: 16, 
            p: 2, 
            bgcolor: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            borderRadius: 1,
            fontSize: '0.75rem',
            maxWidth: 300,
            zIndex: 1000
          }}
        >
          <div>View: {currentView}</div>
          {selectedProduct && (
            <>
              <div>Batch ID: {selectedProduct.batchId}</div>
              <div>Product: {selectedProduct.Product?.name}</div>
              <div>Recipe: {selectedProduct.name}</div>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

export default FactoryDashboard;