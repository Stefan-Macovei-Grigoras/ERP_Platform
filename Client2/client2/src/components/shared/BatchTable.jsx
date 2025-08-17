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
//   Chip,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   TablePagination,
//   TableSortLabel,
//   Tooltip,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   CircularProgress,
//   List,
//   ListItem,
//   ListItemText as MuiListItemText,
//   Card,
//   CardContent,
//   Divider
// } from '@mui/material';
// import {
//   Refresh,
//   MoreVert,
//   Edit,
//   Delete,
//   PlayArrow,
//   Stop,
//   CheckCircle,
//   Visibility,
//   Pause,
//   Assignment,
//   Timer,
//   Person,
//   Add,
//   LocalDining
// } from '@mui/icons-material';
// import adminApiService from '../../services/admin/adminApiService';

// // Helper function to get last completed step
// const getLastCompletedStep = (batch) => {
//   if (!batch.currentSteps || !Array.isArray(batch.currentSteps)) {
//     return 'No steps tracked';
//   }
  
//   const completedSteps = batch.currentSteps.filter(step => step.completed);
//   if (completedSteps.length === 0) {
//     return 'No steps completed';
//   }
  
//   // Get the highest step number that's completed
//   const lastCompleted = completedSteps.reduce((max, step) => 
//     step.stepNumber > max.stepNumber ? step : max
//   );
  
//   return `Step ${lastCompleted.stepNumber}: ${lastCompleted.name}`;
// };

// // Helper function to calculate estimated completion time
// const getEstimatedCompletion = (batch) => {
//   if (!batch.Product?.Recipe?.steps?.steps || !batch.currentSteps) {
//     return 'Unable to calculate';
//   }
  
//   const recipeSteps = batch.Product.Recipe.steps.steps;
//   const currentSteps = batch.currentSteps;
  
//   // Find the next incomplete step
//   const nextIncompleteStep = currentSteps.find(step => !step.completed);
//   if (!nextIncompleteStep) {
//     return 'All steps completed';
//   }
  
//   // Calculate remaining time from current step onwards
//   const nextStepNumber = nextIncompleteStep.stepNumber;
//   const remainingSteps = recipeSteps.filter(step => step.number >= nextStepNumber);
//   const totalRemainingMinutes = remainingSteps.reduce((total, step) => total + (step.duration || 0), 0);
  
//   if (totalRemainingMinutes === 0) {
//     return 'Unable to calculate';
//   }
  
//   // Format time remaining
//   if (totalRemainingMinutes < 60) {
//     return `${totalRemainingMinutes} minutes remaining`;
//   } else if (totalRemainingMinutes < 1440) {
//     const hours = Math.floor(totalRemainingMinutes / 60);
//     const minutes = totalRemainingMinutes % 60;
//     return `${hours}h ${minutes}m remaining`;
//   } else {
//     const days = Math.floor(totalRemainingMinutes / 1440);
//     const hours = Math.floor((totalRemainingMinutes % 1440) / 60);
//     return `${days}d ${hours}h remaining`;
//   }
// };

// function BatchRowSkeleton() {
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

// function BatchTable({ 
//   showAll = false, 
//   allowManagement = false,
//   filterByUser = false,
//   maxRows = null,
//   title = "Batches",
//   userRole = 'admin',
//   dense = false,
//   currentUserId = null
// }) {
//   const [batches, setBatches] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(maxRows || 10);
//   const [orderBy, setOrderBy] = useState('id');
//   const [order, setOrder] = useState('asc');
  
//   // Dialog states
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchBatches();
//     if (userRole === 'admin') {
//       fetchProducts();
//     }
//   }, [showAll, filterByUser, maxRows, orderBy, order, currentUserId]);

//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       let data;
//       if (filterByUser && currentUserId) {
//         data = await adminApiService.getBatchesByUser(currentUserId);
//       } else {
//         data = await adminApiService.getBatches();
//       }
      
//       // Sort batches
//       data.sort((a, b) => {
//         if (order === 'asc') {
//           return a[orderBy] < b[orderBy] ? -1 : 1;
//         }
//         return a[orderBy] > b[orderBy] ? -1 : 1;
//       });
      
//       setBatches(data);
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

//   // // Status color mapping
//   // const getStatusColor = (stage) => {
//   //   switch (stage?.toLowerCase()) {
//   //     case 'done':
//   //       return 'success';
//   //     case 'packaging':
//   //       return 'warning';
//   //     case 'processing':
//   //     case 'start-processing':
//   //     case 'end-processing':
//   //       return 'error';
//   //     case 'due':
//   //       return 'default';
//   //     default:
//   //       return 'default';
//   //   }
//   // };

//   const getStatusColor = (stage) => {
//   switch (stage?.toLowerCase()) {
//     case 'done':
//       return 'success';      // Green - completed
//     case 'packaging':
//       return 'warning';      // Orange - ready for packaging
//     case 'start-processing':
//       return 'primary';      // Blue - production started
//     case 'processing':
//       return 'info';         // Light blue - actively processing
//     case 'end-processing':
//       return 'secondary';    // Purple - processing finished
//     case 'due':
//       return 'error';        // Red - paused/stopped
//     default:
//       return 'default';
//   }
// };

//   // Get product name by ID
//   const getProductName = (productId) => {
//     const product = products.find(p => p.id === productId);
//     return product ? product.name : `Product #${productId}`;
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
//         case 'start':
//           await adminApiService.updateBatchStatus(selectedBatch.id, 'processing');
//           break;
//         case 'pause':
//           await adminApiService.updateBatchStatus(selectedBatch.id, 'paused');
//           break;
//         case 'complete':
//           await adminApiService.updateBatchStatus(selectedBatch.id, 'done');
//           break;
//         case 'delete':
//           if (window.confirm(`Are you sure you want to delete batch ${selectedBatch.id}?`)) {
//             await adminApiService.deleteBatch(selectedBatch.id);
//           }
//           break;
//         case 'view':
//           setDetailsDialogOpen(true);
//           return; // Don't refresh data for view action
//         case 'edit':
//           console.log('Edit batch:', selectedBatch.id);
//           break;
//         default:
//           break;
//       }
      
//       // Refresh data after action (except for view)
//       await fetchBatches();
      
//     } catch (err) {
//       console.error('Failed to execute batch action:', err);
//       setError('Failed to execute action. Please try again.');
//     }
    
//     handleMenuClose();
//   };

//   // Get available actions based on user role and batch status
//   const getAvailableActions = (batch) => {
//     const actions = [];
    
//     // View details is always available
//     actions.push({ icon: <Visibility />, label: 'View Details', action: 'view' });
    
//     if (allowManagement) {
//       // Status-specific actions
//       switch (batch.stage) {
//         case 'due':
//           actions.push({ icon: <PlayArrow />, label: 'Start Batch', action: 'start' });
//           break;
//         case 'processing':
//           actions.push({ icon: <Pause />, label: 'Pause', action: 'pause' });
//           actions.push({ icon: <CheckCircle />, label: 'Complete', action: 'complete' });
//           break;
//         case 'paused':
//           actions.push({ icon: <PlayArrow />, label: 'Resume', action: 'start' });
//           break;
//       }
      
//       // Edit is available for non-completed batches
//       if (batch.stage !== 'done') {
//         actions.push({ icon: <Edit />, label: 'Edit', action: 'edit' });
//       }
      
//       // Admin-only actions
//       if (userRole === 'admin') {
//         actions.push({ icon: <Delete />, label: 'Delete', action: 'delete' });
//       }
//     }
    
//     return actions;
//   };

//   // Handle create batch
//   const handleCreateBatch = () => {
//     setSelectedProduct(null);
//     setCreateDialogOpen(true);
//   };

//   const handleSelectProduct = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleSubmitBatch = async () => {
//     try {
//       setSubmitting(true);
//       setError(null);

//       const batchData = {
//         productId: selectedProduct.id,
//         stage: 'due'
//       };

//       await adminApiService.createBatch(batchData);
//       await fetchBatches();
//       setCreateDialogOpen(false);
//       setSelectedProduct(null);
//     } catch (err) {
//       console.error('Failed to create batch:', err);
//       setError('Failed to create batch. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle sorting
//   const handleSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   // Handle pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRefresh = () => {
//     fetchBatches();
//   };

//   // Get displayed batches for pagination
//   const getDisplayedBatches = () => {
//     if (maxRows) {
//       return batches.slice(0, maxRows);
//     }
//     return batches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//   };

//   // Format batch details for display
//   const formatBatchDetails = (batch) => {
//     const details = [
//       { 
//         label: 'Product/Batch Name', 
//         value: `${getProductName(batch.productId)} (Batch #${batch.id})`,
//         icon: <LocalDining />
//       },
//       { 
//         label: 'Current Stage', 
//         value: batch.stage?.charAt(0).toUpperCase() + batch.stage?.slice(1) || 'Unknown',
//         icon: <Assignment />,
//         chip: true,
//         chipColor: getStatusColor(batch.stage)
//       },
//       { 
//         label: 'Last Completed Step', 
//         value: getLastCompletedStep(batch),
//         icon: <CheckCircle />
//       },
//       { 
//         label: 'Time Until Completion', 
//         value: getEstimatedCompletion(batch),
//         icon: <Timer />
//       },
//       { 
//         label: 'Created Date', 
//         value: batch.createdAt ? new Date(batch.createdAt).toLocaleString() : 'N/A',
//         icon: <Add />
//       }
//     ];

//     return details;
//   };

//   return (
//     <Paper elevation={2} sx={{ height: 'fit-content' }}>
//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Header with title and action buttons */}
//       <Box 
//         display="flex" 
//         justifyContent="space-between" 
//         alignItems="center" 
//         sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
//       >
//         <Box>
//           <Typography variant="h6" fontWeight="bold">
//             {title}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             {batches.length} total batches
//           </Typography>
//         </Box>
//         <Box display="flex" gap={1}>
//           <Tooltip title="Refresh">
//             <IconButton 
//               onClick={handleRefresh} 
//               size="small" 
//               disabled={loading}
//             >
//               <Refresh />
//             </IconButton>
//           </Tooltip>
          
//           {/* Create Batch button - only for admins */}
//           {userRole === 'admin' && (
//             <Button 
//               variant="contained" 
//               startIcon={<Add />}
//               onClick={handleCreateBatch}
//               size="small"
//             >
//               Create Batch
//             </Button>
//           )}
//         </Box>
//       </Box>

//       {/* Batches table */}
//       <TableContainer>
//         <Table size={dense ? "small" : "medium"}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Batch ID</TableCell>
//               <TableCell>Product</TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'stage'}
//                   direction={orderBy === 'stage' ? order : 'asc'}
//                   onClick={() => handleSort('stage')}
//                 >
//                   Stage
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Created</TableCell>
//               {allowManagement && <TableCell align="right">Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               // Show skeleton rows while loading
//               Array.from({ length: maxRows || 5 }).map((_, index) => (
//                 <BatchRowSkeleton key={index} />
//               ))
//             ) : getDisplayedBatches().length > 0 ? (
//               // Show actual batch data
//               getDisplayedBatches().map((batch) => (
//                 <TableRow key={batch.id} hover>
//                   <TableCell>
//                     <Typography variant="body2" fontWeight="medium">
//                       #{batch.id}
//                     </Typography>
//                   </TableCell>
                  
//                   <TableCell>
//                     <Typography variant="body2" fontWeight="medium">
//                       {getProductName(batch.productId)}
//                     </Typography>
//                     <Typography variant="caption" color="textSecondary">
//                       ID: {batch.productId}
//                     </Typography>
//                   </TableCell>
                  
//                   <TableCell>
//                     <Badge
//                       color={getStatusColor(batch.stage)}
//                       variant="dot"
//                       sx={{ mr: 1 }}
//                     />
//                     <Typography variant="body2">
//                       {batch.stage}
//                     </Typography>
//                   </TableCell>
                  
//                   <TableCell>
//                     <Typography variant="body2">
//                       {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
//                     </Typography>
//                     <Typography variant="caption" color="textSecondary">
//                       {batch.createdAt ? new Date(batch.createdAt).toLocaleTimeString() : ''}
//                     </Typography>
//                   </TableCell>
                  
//                   {allowManagement && (
//                     <TableCell align="right">
//                       <IconButton 
//                         size="small"
//                         onClick={(e) => handleMenuClick(e, batch)}
//                       >
//                         <MoreVert />
//                       </IconButton>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))
//             ) : (
//               // Show empty state
//               <TableRow>
//                 <TableCell 
//                   colSpan={allowManagement ? 5 : 4} 
//                   align="center"
//                   sx={{ py: 4 }}
//                 >
//                   <Typography color="textSecondary">
//                     No batches found
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       {!maxRows && batches.length > 0 && (
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={batches.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       )}

//       {/* Action menu */}
//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={handleMenuClose}
//       >
//         {selectedBatch && getAvailableActions(selectedBatch).map((action, index) => (
//           <MenuItem 
//             key={index}
//             onClick={() => handleBatchAction(action.action)}
//             sx={action.action === 'delete' ? { color: 'error.main' } : {}}
//           >
//             <ListItemIcon sx={action.action === 'delete' ? { color: 'error.main' } : {}}>
//               {action.icon}
//             </ListItemIcon>
//             <ListItemText primary={action.label} />
//           </MenuItem>
//         ))}
//       </Menu>

//       {/* Create Batch Dialog */}
//       <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Create New Batch
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//               Select a product to create a batch for:
//             </Typography>
            
//             {products.length > 0 ? (
//               <List sx={{ maxHeight: 300, overflow: 'auto' }}>
//                 {products.map((product) => (
//                   <ListItem
//                     key={product.id}
//                     button
//                     selected={selectedProduct?.id === product.id}
//                     onClick={() => handleSelectProduct(product)}
//                     sx={{
//                       border: 1,
//                       borderColor: selectedProduct?.id === product.id ? 'primary.main' : 'divider',
//                       borderRadius: 1,
//                       mb: 1,
//                       '&:hover': {
//                         borderColor: 'primary.main'
//                       }
//                     }}
//                   >
//                     <Box display="flex" alignItems="center" gap={2} width="100%">
//                       <LocalDining color={selectedProduct?.id === product.id ? 'primary' : 'disabled'} />
//                       <Box flexGrow={1}>
//                         <Typography variant="body1" fontWeight="medium">
//                           {product.name}
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           ID: {product.id} | Price: {product.price} RON | Qty: {product.quantity}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
//                 No products available
//               </Typography>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateDialogOpen(false)} disabled={submitting}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleSubmitBatch}
//             variant="contained"
//             disabled={submitting || !selectedProduct}
//             startIcon={submitting ? <CircularProgress size={20} /> : null}
//           >
//             {submitting ? 'Creating...' : 'Create Batch'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Batch Details Dialog */}
//       <Dialog 
//         open={detailsDialogOpen} 
//         onClose={() => setDetailsDialogOpen(false)} 
//         maxWidth="md" 
//         fullWidth
//       >
//         <DialogTitle>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Visibility color="primary" />
//             <Typography variant="h6" fontWeight="bold">
//               Batch Details - #{selectedBatch?.id}
//             </Typography>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           {selectedBatch && (
//             <Box sx={{ mt: 2 }}>
//               {/* Main Details Card */}
//               <Card elevation={2} sx={{ mb: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
//                     Batch Information
//                   </Typography>
                  
//                   <Grid container spacing={3}>
//                     {formatBatchDetails(selectedBatch).map((detail, index) => (
//                       <Grid item xs={12} key={index}>
//                         <Box display="flex" alignItems="center" gap={2} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//                           <Box sx={{ color: 'primary.main' }}>
//                             {detail.icon}
//                           </Box>
//                           <Box flexGrow={1}>
//                             <Typography variant="body2" color="textSecondary" fontWeight="medium">
//                               {detail.label}
//                             </Typography>
//                             {detail.chip ? (
//                               <Chip 
//                                 label={detail.value} 
//                                 color={detail.chipColor} 
//                                 size="small" 
//                                 sx={{ mt: 0.5 }}
//                               />
//                             ) : (
//                               <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
//                                 {detail.value}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* Production Progress Card */}
//               {selectedBatch.currentSteps && Array.isArray(selectedBatch.currentSteps) && (
//                 <Card elevation={2} sx={{ mb: 3 }}>
//                   <CardContent>
//                     <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
//                       Production Progress
//                     </Typography>
                    
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>
//                         Steps Completed: {selectedBatch.currentSteps.filter(s => s.completed).length} / {selectedBatch.currentSteps.length}
//                       </Typography>
//                       <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
//                         <Box 
//                           sx={{ 
//                             width: `${(selectedBatch.currentSteps.filter(s => s.completed).length / selectedBatch.currentSteps.length) * 100}%`,
//                             bgcolor: 'success.main',
//                             height: '100%',
//                             borderRadius: 1,
//                             transition: 'width 0.3s ease'
//                           }}
//                         />
//                       </Box>
//                     </Box>

//                     <List dense>
//                       {selectedBatch.currentSteps.map((step, index) => (
//                         <ListItem key={index} sx={{ px: 0 }}>
//                           <Box display="flex" alignItems="center" gap={2} width="100%">
//                             {step.completed ? (
//                               <CheckCircle color="success" />
//                             ) : (
//                               <Box 
//                                 sx={{ 
//                                   width: 24, 
//                                   height: 24, 
//                                   borderRadius: '50%', 
//                                   border: 2, 
//                                   borderColor: 'grey.300',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center'
//                                 }}
//                               >
//                                 <Typography variant="caption" color="textSecondary">
//                                   {step.stepNumber}
//                                 </Typography>
//                               </Box>
//                             )}
//                             <Box flexGrow={1}>
//                               <Typography 
//                                 variant="body2" 
//                                 fontWeight={step.completed ? 'normal' : 'medium'}
//                                 color={step.completed ? 'textSecondary' : 'textPrimary'}
//                                 sx={{ textDecoration: step.completed ? 'line-through' : 'none' }}
//                               >
//                                 Step {step.stepNumber}: {step.name}
//                               </Typography>
//                             </Box>
//                             {step.completed && (
//                               <Chip label="Complete" color="success" size="small" />
//                             )}
//                           </Box>
//                         </ListItem>
//                       ))}
//                     </List>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Technical Details Card (Collapsible) */}
//               <Card elevation={1}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.secondary' }}>
//                     Technical Details
//                   </Typography>
//                   <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//                     <Typography variant="caption" color="textSecondary" fontWeight="bold" gutterBottom>
//                       Raw Batch Data:
//                     </Typography>
//                     <Box component="pre" sx={{ 
//                       fontSize: '0.75rem', 
//                       fontFamily: 'monospace',
//                       whiteSpace: 'pre-wrap',
//                       wordBreak: 'break-word',
//                       mt: 1,
//                       maxHeight: 200,
//                       overflow: 'auto'
//                     }}>
//                       {JSON.stringify(selectedBatch, null, 2)}
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDetailsDialogOpen(false)} variant="outlined">
//             Close
//           </Button>
//           {selectedBatch?.stage === 'due' && (
//             <Button 
//               variant="contained" 
//               startIcon={<PlayArrow />}
//               onClick={() => {
//                 setDetailsDialogOpen(false);
//                 handleBatchAction('start');
//               }}
//             >
//               Start Production
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// }

// export default BatchTable;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Badge,
  Skeleton,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText as MuiListItemText,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Refresh,
  MoreVert,
  Edit,
  Delete,
  PlayArrow,
  Stop,
  CheckCircle,
  Visibility,
  Pause,
  Assignment,
  Timer,
  Person,
  Add,
  LocalDining
} from '@mui/icons-material';
import adminApiService from '../../services/admin/adminApiService';

// Helper function to get last completed step
const getLastCompletedStep = (batch) => {
  if (!batch.currentSteps || !Array.isArray(batch.currentSteps)) {
    return 'No steps tracked';
  }
  
  const completedSteps = batch.currentSteps.filter(step => step.completed);
  if (completedSteps.length === 0) {
    return 'No steps completed';
  }
  
  // Get the highest step number that's completed
  const lastCompleted = completedSteps.reduce((max, step) => 
    step.stepNumber > max.stepNumber ? step : max
  );
  
  return `Step ${lastCompleted.stepNumber}: ${lastCompleted.name}`;
};

// Helper function to calculate estimated completion time
const getEstimatedCompletion = (batch) => {
  if (!batch.Product?.Recipe?.steps?.steps || !batch.currentSteps) {
    return 'Unable to calculate';
  }
  
  const recipeSteps = batch.Product.Recipe.steps.steps;
  const currentSteps = batch.currentSteps;
  
  // Find the next incomplete step
  const nextIncompleteStep = currentSteps.find(step => !step.completed);
  if (!nextIncompleteStep) {
    return 'All steps completed';
  }
  
  // Calculate remaining time from current step onwards
  const nextStepNumber = nextIncompleteStep.stepNumber;
  const remainingSteps = recipeSteps.filter(step => step.number >= nextStepNumber);
  const totalRemainingMinutes = remainingSteps.reduce((total, step) => total + (step.duration || 0), 0);
  
  if (totalRemainingMinutes === 0) {
    return 'Unable to calculate';
  }
  
  // Format time remaining
  if (totalRemainingMinutes < 60) {
    return `${totalRemainingMinutes} minutes remaining`;
  } else if (totalRemainingMinutes < 1440) {
    const hours = Math.floor(totalRemainingMinutes / 60);
    const minutes = totalRemainingMinutes % 60;
    return `${hours}h ${minutes}m remaining`;
  } else {
    const days = Math.floor(totalRemainingMinutes / 1440);
    const hours = Math.floor((totalRemainingMinutes % 1440) / 60);
    return `${days}d ${hours}h remaining`;
  }
};

function BatchRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell align="right"><Skeleton variant="rectangular" width={60} height={24} /></TableCell>
    </TableRow>
  );
}

function BatchTable({ 
  showAll = false, 
  allowManagement = false,
  filterByUser = false,
  maxRows = null,
  title = "Batches",
  userRole = 'admin',
  dense = false,
  currentUserId = null
}) {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(maxRows || 10);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBatches();
    if (userRole === 'admin') {
      fetchProducts();
    }
  }, [showAll, filterByUser, maxRows, orderBy, order, currentUserId]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (filterByUser && currentUserId) {
        data = await adminApiService.getBatchesByUser(currentUserId);
      } else {
        data = await adminApiService.getBatches();
      }
      
      // Sort batches
      data.sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy] < b[orderBy] ? -1 : 1;
        }
        return a[orderBy] > b[orderBy] ? -1 : 1;
      });
      
      setBatches(data);
    } catch (err) {
      console.error('Failed to fetch batches:', err);
      setError('Failed to load batches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await adminApiService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  // Status color mapping with distinct colors for each stage
  const getStatusColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'done':
        return 'success';      // Green - completed
      case 'packaging':
        return 'warning';      // Orange - ready for packaging
      case 'start-processing':
        return 'primary';      // Blue - production started
      case 'processing':
        return 'info';         // Light blue - actively processing
      case 'end-processing':
        return 'secondary';    // Purple - processing finished
      case 'due':
        return 'error';        // Red - waiting to start
      case 'paused':
        return 'default';      // Gray - paused/stopped
      default:
        return 'default';
    }
  };

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  // Handle action menu
  const handleMenuClick = (event, batch) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBatch(batch);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBatch(null);
  };

  // Handle batch actions
  const handleBatchAction = async (action) => {
    try {
      setError(null);
      
      switch (action) {
        case 'start':
          await adminApiService.updateBatchStatus(selectedBatch.id, 'processing');
          break;
        case 'pause':
          await adminApiService.updateBatchStatus(selectedBatch.id, 'paused');
          break;
        case 'complete':
          await adminApiService.updateBatchStatus(selectedBatch.id, 'done');
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete batch ${selectedBatch.id}?`)) {
            await adminApiService.deleteBatch(selectedBatch.id);
          }
          break;
        case 'view':
          setDetailsDialogOpen(true);
          return; // Don't refresh data for view action
        case 'edit':
          console.log('Edit batch:', selectedBatch.id);
          break;
        default:
          break;
      }
      
      // Refresh data after action (except for view)
      await fetchBatches();
      
    } catch (err) {
      console.error('Failed to execute batch action:', err);
      setError('Failed to execute action. Please try again.');
    }
    
    handleMenuClose();
  };

  // Get available actions based on user role and batch status
  const getAvailableActions = (batch) => {
    const actions = [];
    
    // View details is always available
    actions.push({ icon: <Visibility />, label: 'View Details', action: 'view' });
    
    if (allowManagement) {
      // Status-specific actions
      switch (batch.stage) {
        case 'due':
          actions.push({ icon: <PlayArrow />, label: 'Start Batch', action: 'start' });
          break;
        case 'processing':
          actions.push({ icon: <Pause />, label: 'Pause', action: 'pause' });
          actions.push({ icon: <CheckCircle />, label: 'Complete', action: 'complete' });
          break;
        case 'paused':
          actions.push({ icon: <PlayArrow />, label: 'Resume', action: 'start' });
          break;
      }
      
      // Edit is available for non-completed batches
      if (batch.stage !== 'done') {
        actions.push({ icon: <Edit />, label: 'Edit', action: 'edit' });
      }
      
      // Admin-only actions
      if (userRole === 'admin') {
        actions.push({ icon: <Delete />, label: 'Delete', action: 'delete' });
      }
    }
    
    return actions;
  };

  // Handle create batch
  const handleCreateBatch = () => {
    setSelectedProduct(null);
    setCreateDialogOpen(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSubmitBatch = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const batchData = {
        productId: selectedProduct.id,
        stage: 'due'
      };

      await adminApiService.createBatch(batchData);
      await fetchBatches();
      setCreateDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Failed to create batch:', err);
      setError('Failed to create batch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchBatches();
  };

  // Get displayed batches for pagination
  const getDisplayedBatches = () => {
    if (maxRows) {
      return batches.slice(0, maxRows);
    }
    return batches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  // Format batch details for display
  const formatBatchDetails = (batch) => {
    const details = [
      { 
        label: 'Product/Batch Name', 
        value: `${getProductName(batch.productId)} (Batch #${batch.id})`,
        icon: <LocalDining />
      },
      { 
        label: 'Current Stage', 
        value: batch.stage?.charAt(0).toUpperCase() + batch.stage?.slice(1) || 'Unknown',
        icon: <Assignment />,
        chip: true,
        chipColor: getStatusColor(batch.stage)
      },
      { 
        label: 'Last Completed Step', 
        value: getLastCompletedStep(batch),
        icon: <CheckCircle />
      },
      { 
        label: 'Time Until Completion', 
        value: getEstimatedCompletion(batch),
        icon: <Timer />
      },
      { 
        label: 'Created Date', 
        value: batch.createdAt ? new Date(batch.createdAt).toLocaleString() : 'N/A',
        icon: <Add />
      }
    ];

    return details;
  };

  return (
    <Paper elevation={2} sx={{ height: 'fit-content'}}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header with title and action buttons */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {batches.length} total batches
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={handleRefresh} 
              size="small" 
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          
          {/* Create Batch button - only for admins */}
          {userRole === 'admin' && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={handleCreateBatch}
              size="small"
            >
              Create Batch
            </Button>
          )}
        </Box>
      </Box>

      {/* Batches table */}
      <TableContainer >
        <Table size={dense ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Batch ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'stage'}
                  direction={orderBy === 'stage' ? order : 'asc'}
                  onClick={() => handleSort('stage')}
                >
                  Stage
                </TableSortLabel>
              </TableCell>
              <TableCell>Created</TableCell>
              {allowManagement && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show skeleton rows while loading
              Array.from({ length: maxRows || 5 }).map((_, index) => (
                <BatchRowSkeleton key={index} />
              ))
            ) : getDisplayedBatches().length > 0 ? (
              // Show actual batch data
              getDisplayedBatches().map((batch) => (
                <TableRow key={batch.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{batch.id}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {getProductName(batch.productId)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {batch.productId}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={batch.stage}
                      color={getStatusColor(batch.stage)}
                      size="small"
                      sx={{ 
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {batch.createdAt ? new Date(batch.createdAt).toLocaleTimeString() : ''}
                    </Typography>
                  </TableCell>
                  
                  {allowManagement && (
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuClick(e, batch)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              // Show empty state
              <TableRow>
                <TableCell 
                  colSpan={allowManagement ? 5 : 4} 
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography color="textSecondary">
                    No batches found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!maxRows && batches.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={batches.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Action menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedBatch && getAvailableActions(selectedBatch).map((action, index) => (
          <MenuItem 
            key={index}
            onClick={() => handleBatchAction(action.action)}
            sx={action.action === 'delete' ? { color: 'error.main' } : {}}
          >
            <ListItemIcon sx={action.action === 'delete' ? { color: 'error.main' } : {}}>
              {action.icon}
            </ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Create Batch Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Batch
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Select a product to create a batch for:
            </Typography>
            
            {products.length > 0 ? (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {products.map((product) => (
                  <ListItem
                    key={product.id}
                    button
                    selected={selectedProduct?.id === product.id}
                    onClick={() => handleSelectProduct(product)}
                    sx={{
                      border: 1,
                      borderColor: selectedProduct?.id === product.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <LocalDining color={selectedProduct?.id === product.id ? 'primary' : 'disabled'} />
                      <Box flexGrow={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {product.id} | Price: {product.price} RON | Qty: {product.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No products available
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitBatch}
            variant="contained"
            disabled={submitting || !selectedProduct}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Creating...' : 'Create Batch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Visibility color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Batch Details - #{selectedBatch?.id}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBatch && (
            <Box sx={{ mt: 2 }}>
              {/* Main Details Card */}
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                    Batch Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {formatBatchDetails(selectedBatch).map((detail, index) => (
                      <Grid item xs={12} key={index}>
                        <Box display="flex" alignItems="center" gap={2} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {detail.icon}
                          </Box>
                          <Box flexGrow={1}>
                            <Typography variant="body2" color="textSecondary" fontWeight="medium">
                              {detail.label}
                            </Typography>
                            {detail.chip ? (
                              <Chip 
                                label={detail.value} 
                                color={detail.chipColor} 
                                size="small" 
                                sx={{ mt: 0.5 }}
                              />
                            ) : (
                              <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                                {detail.value}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Production Progress Card */}
              {selectedBatch.currentSteps && Array.isArray(selectedBatch.currentSteps) && (
                <Card elevation={2} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                      Production Progress
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Steps Completed: {selectedBatch.currentSteps.filter(s => s.completed).length} / {selectedBatch.currentSteps.length}
                      </Typography>
                      <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                        <Box 
                          sx={{ 
                            width: `${(selectedBatch.currentSteps.filter(s => s.completed).length / selectedBatch.currentSteps.length) * 100}%`,
                            bgcolor: 'success.main',
                            height: '100%',
                            borderRadius: 1,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </Box>
                    </Box>

                    <List dense>
                      {selectedBatch.currentSteps.map((step, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <Box display="flex" alignItems="center" gap={2} width="100%">
                            {step.completed ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Box 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  border: 2, 
                                  borderColor: 'grey.300',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Typography variant="caption" color="textSecondary">
                                  {step.stepNumber}
                                </Typography>
                              </Box>
                            )}
                            <Box flexGrow={1}>
                              <Typography 
                                variant="body2" 
                                fontWeight={step.completed ? 'normal' : 'medium'}
                                color={step.completed ? 'textSecondary' : 'textPrimary'}
                                sx={{ textDecoration: step.completed ? 'line-through' : 'none' }}
                              >
                                Step {step.stepNumber}: {step.name}
                              </Typography>
                            </Box>
                            {step.completed && (
                              <Chip label="Complete" color="success" size="small" />
                            )}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Technical Details Card (Collapsible) */}
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.secondary' }}>
                    Technical Details
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary" fontWeight="bold" gutterBottom>
                      Raw Batch Data:
                    </Typography>
                    <Box component="pre" sx={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      mt: 1,
                      maxHeight: 200,
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(selectedBatch, null, 2)}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)} variant="outlined">
            Close
          </Button>
          {selectedBatch?.stage === 'due' && (
            <Button 
              variant="contained" 
              startIcon={<PlayArrow />}
              onClick={() => {
                setDetailsDialogOpen(false);
                handleBatchAction('start');
              }}
            >
              Start Production
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default BatchTable;