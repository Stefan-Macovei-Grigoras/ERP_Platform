
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
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
  LocalDining,
  Save,
  Cancel
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
  // State declarations
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit form states
  const [editForm, setEditForm] = useState({
    stage: '',
    lastCompletedStep: 0
  });

  // Available batch stages
  const availableStages = [
    { value: 'due', label: 'Due', description: 'Waiting to start production' },
    { value: 'start-processing', label: 'Start Processing', description: 'Production has begun' },
    { value: 'end-processing', label: 'End Processing', description: 'Production completed' },
    { value: 'packaging', label: 'Packaging', description: 'Ready for packaging' },
    { value: 'done', label: 'Done', description: 'Completely finished' }
  ];

  // Effects
  useEffect(() => {
    fetchBatches();
    if (userRole === 'admin') {
      fetchProducts();
    }
  }, [showAll, filterByUser, maxRows, orderBy, order, currentUserId]);

  // API Functions
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

  // Utility Functions
  const getStatusColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'done':
        return 'success';
      case 'packaging':
        return 'warning';
      case 'start-processing':
        return 'primary';
      case 'end-processing':
        return 'secondary';
      case 'due':
        return 'error';

      default:
        return 'default';
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  const getAvailableSteps = () => {
    if (!selectedBatch?.currentSteps || !Array.isArray(selectedBatch.currentSteps)) {
      return [];
    }
    return selectedBatch.currentSteps.sort((a, b) => a.stepNumber - b.stepNumber);
  };

  const getDisplayedBatches = () => {
    if (maxRows) {
      return batches.slice(0, maxRows);
    }
    return batches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

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

  const getAvailableActions = (batch) => {
    const actions = [];
    
    // View details is always available
    actions.push({ icon: <Visibility />, label: 'View Details', action: 'view' });
    
    if (allowManagement) {
      // Status-specific actions
      switch (batch.stage) {

        case 'processing':
          actions.push({ icon: <Pause />, label: 'Pause', action: 'pause' });
          actions.push({ icon: <CheckCircle />, label: 'Complete', action: 'complete' });
          break;
      }
      
      // Edit is available for non-completed batches
      //if (batch.stage !== 'done') {
        actions.push({ icon: <Edit />, label: 'Edit', action: 'edit' });
      //}
      
      // Admin-only actions
      if (userRole === 'admin') {
        actions.push({ icon: <Delete />, label: 'Delete', action: 'delete' });
      }
    }
    
    return actions;
  };

  // Event Handlers
  const handleMenuClick = (event, batch) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBatch(batch);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBatch(null);
  };

  const initializeEditForm = (batch) => {
    const lastCompletedStepNumber = batch.currentSteps && Array.isArray(batch.currentSteps) 
      ? Math.max(...batch.currentSteps.filter(step => step.completed).map(step => step.stepNumber), 0)
      : 0;

    setEditForm({
      stage: batch.stage || '',
      lastCompletedStep: lastCompletedStepNumber
    });
  };

  const handleBatchAction = async (action) => {
    try {
      setError(null);
      
      switch (action) {
        case 'start':
          await adminApiService.updateBatchStatus(selectedBatch.id, 'processing');
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
          return;
        case 'edit':
          initializeEditForm(selectedBatch);
          setEditDialogOpen(true);
          return;
        default:
          break;
      }
      
      await fetchBatches();
      
    } catch (err) {
      console.error('Failed to execute batch action:', err);
      setError('Failed to execute action. Please try again.');
    }
    
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const updateData = {
        stage: editForm.stage
      };

      // If stage is start-processing and we have steps, update the completion status
      if (editForm.stage === 'start-processing' && selectedBatch.currentSteps && editForm.lastCompletedStep > 0) {
        // Mark steps as completed up to the specified step number
        const updatedSteps = selectedBatch.currentSteps.map(step => ({
          ...step,
          completed: step.stepNumber <= editForm.lastCompletedStep,
          completedAt: step.stepNumber <= editForm.lastCompletedStep ? new Date().toISOString() : null
        }));
        
        updateData.currentSteps = updatedSteps;
      }

      // Call API to update batch
      await adminApiService.updateBatch(selectedBatch.id, updateData);
      
      // Refresh data
      await fetchBatches();
      
      // Close dialog
      setEditDialogOpen(false);
      handleMenuClose();
      
    } catch (err) {
      console.error('Failed to update batch:', err);
      setError('Failed to update batch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
      <TableContainer>
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

      {/* Edit Batch Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Edit color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Edit Batch #{selectedBatch?.id}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Current Stage Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Batch Stage</InputLabel>
                  <Select
                    value={editForm.stage}
                    onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })}
                    label="Batch Stage"
                  >
                    {availableStages.map((stage) => (
                      <MenuItem key={stage.value} value={stage.value}>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {stage.label}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {stage.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select the current stage of the batch
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Last Completed Step - Only show if stage is start-processing */}
              {editForm.stage === 'start-processing' && getAvailableSteps().length > 0 && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Last Completed Step</InputLabel>
                    <Select
                      value={editForm.lastCompletedStep}
                      onChange={(e) => setEditForm({ ...editForm, lastCompletedStep: e.target.value })}
                      label="Last Completed Step"
                    >
                      <MenuItem value={0}>
                        <Typography color="textSecondary">No steps completed</Typography>
                      </MenuItem>
                      {getAvailableSteps().map((step) => (
                        <MenuItem key={step.stepNumber} value={step.stepNumber}>
                          <Box>
                            <Typography variant="body1">
                              Step {step.stepNumber}: {step.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      All steps up to and including this step will be marked as completed
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}

              {/* Current Batch Info */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Current Batch Information:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Product: {getProductName(selectedBatch?.productId)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Current Stage: {selectedBatch?.stage}
                    </Typography>
                    {selectedBatch?.currentSteps && (
                      <Typography variant="body2" color="textSecondary">
                        Steps: {selectedBatch.currentSteps.filter(s => s.completed).length} / {selectedBatch.currentSteps.length} completed
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submitting} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            disabled={submitting || !editForm.stage}
            startIcon={submitting ? <CircularProgress size={20} /> : <Save />}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

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

              {/* Technical Details Card */}
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