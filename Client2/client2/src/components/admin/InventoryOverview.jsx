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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Warning,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Inventory,
  ShoppingCart,
  MoreVert,
  History,
  LocalShipping
} from '@mui/icons-material';
import adminApiService from '../../services/admin/adminApiService';

const categories = ['Raw Materials', 'Additives', 'Packaging', 'Cleaning Supplies', 'Equipment'];

/**
 * Skeleton component for loading state - shows placeholder rows while data is being fetched
 */
function InventoryRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Box>
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={80} />
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ width: 100 }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="rectangular" height={4} sx={{ mt: 0.5 }} />
          <Skeleton variant="text" width={60} />
        </Box>
      </TableCell>
      <TableCell><Skeleton variant="text" width={60} /></TableCell>
      <TableCell align="right"><Skeleton variant="circular" width={24} height={24} /></TableCell>
    </TableRow>
  );
}

function InventoryOverview() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Dialog and menu states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    minThreshold: '',
  });

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  
  useEffect(() => {
    fetchInventory();
  }, []);

  /**
   * Fetch inventory data from API
   */
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Get stock status and color based on current stock levels
   */
  const getStockStatus = (item) => {
    if (!item.maxCapacity) {
      // If no maxCapacity, just use threshold comparison
      const belowThreshold = item.quantity <= item.minThreshold;
      
      if (item.quantity === 0) {
        return { label: 'Out of Stock', color: 'error', icon: <Warning /> };
      } else if (belowThreshold) {
        return { label: 'Low Stock', color: 'warning', icon: <TrendingDown /> };
      } else {
        return { label: 'Good', color: 'success', icon: <CheckCircle /> };
      }
    }
    
    const stockPercentage = (item.quantity / item.maxCapacity) * 100;
    const belowThreshold = item.quantity <= item.minThreshold;
    
    if (item.quantity === 0) {
      return { label: 'Out of Stock', color: 'error', icon: <Warning /> };
    } else if (belowThreshold || item.status === 'Critical') {
      return { label: 'Critical', color: 'error', icon: <Warning /> };
    } else if (item.status === 'Low Stock' || stockPercentage < 30) {
      return { label: 'Low Stock', color: 'warning', icon: <TrendingDown /> };
    } else {
      return { label: 'Good', color: 'success', icon: <CheckCircle /> };
    }
  };

  /**
   * Calculate stock level percentage for progress bar
   */
  const getStockPercentage = (item) => {
    if (!item.maxCapacity) {
      // If no maxCapacity, calculate based on threshold * 2
      const estimatedMax = item.minThreshold * 2;
      return Math.max(0, Math.min(100, (item.quantity / estimatedMax) * 100));
    }
    return Math.max(0, Math.min(100, (item.quantity / item.maxCapacity) * 100));
  };

  /**
   * Get critical items count for alert
   */
  const getCriticalItemsCount = () => {
    return inventory.filter(item => 
      item.quantity <= item.minThreshold || item.status === 'Critical'
    ).length;
  };

  // ============================================================================
  // MENU HANDLERS
  // ============================================================================
  
  const handleMenuClick = (event, item) => {
    setSelectedItem(item);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    //setSelectedItem(null);
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================
  
  /**
   * Handle adding new inventory item
   */
  const handleAddItem = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      quantity: '',
      minThreshold: '',
    });
    setAddDialogOpen(true);
  };

  /**
   * Handle editing existing inventory item
   */
  const handleEditItem = (item) => {
     console.log("Item being selected:", item); // Log the parameter, not the state
    setSelectedItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      minThreshold: item.minThreshold.toString(),
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handle deleting inventory item
   */
  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handle restocking item with prompt
   */
  const handleRestock = async (item) => {
    const restockAmount = prompt(`Enter restock amount for ${item.name}:`);
    console.log('Item id:', item.id);
    if (restockAmount && !isNaN(restockAmount)) {
      try {
        setError(null);
        const newStock = item.quantity + parseInt(restockAmount);
        
        // Update item stock via API
        const updatedItem = await adminApiService.updateInventoryItem(item.id, {
          ...item,
          quantity: newStock,
          lastRestocked: new Date().toISOString().split('T')[0],
          status: newStock > item.minThreshold ? 'Good' : 'Low Stock'
        });
        
        // Update local state
        setInventory(prev => prev.map(invItem => 
          invItem.id === item.id ? updatedItem : invItem
        ));
      } catch (err) {
        console.error('Failed to restock item:', err);
        setError('Failed to restock item. Please try again.');
      }
    }
    handleMenuClose();
  };

  /**
   * Handle form submission for add/edit operations
   */
  const handleSubmit = async (isEdit = false) => {
    try {
      setSubmitting(true);
      setError(null);
      // Prepare item data
      const itemData = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        minThreshold: parseInt(formData.minThreshold) || 0,
      };
      if (isEdit) {
        // Update existing item
        const updatedItem = await adminApiService.updateInventoryItem(selectedItem.id, itemData);
        setInventory(prev => prev.map(item => 
          item.id === selectedItem.id ? updatedItem : item
        ));
        setEditDialogOpen(false);
      } else {
        // Add new item
        const newItem = await adminApiService.createInventoryItem({
          ...itemData,
          lastRestocked: new Date().toISOString().split('T')[0],
          status: itemData.quantity > itemData.minThreshold ? 'Good' : 'Low Stock'
        });
        setInventory(prev => [...prev, newItem]);
        setAddDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to save inventory item:', err);
      setError('Failed to save inventory item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle confirming item deletion
   */
  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      await adminApiService.deleteInventoryItem(selectedItem.id);
      setInventory(prev => prev.filter(item => item.id !== selectedItem.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete inventory item:', err);
      setError('Failed to delete inventory item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle refresh button
   */
  const handleRefresh = () => {
    fetchInventory();
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================
  
  const criticalItems = getCriticalItemsCount();

  return (
    <Box sx={{ height: '90vh', overflow: 'hidden' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Page header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Inventory Overview
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monitor stock levels and manage inventory
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleAddItem}
          >
            Add New Item
          </Button>
        </Box>
      </Box>

      {/* Critical alerts */}
      {!loading && criticalItems > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{criticalItems} items</strong> require immediate attention due to low stock levels.
          </Typography>
        </Alert>
      )}

      {/* Inventory table */}
      <Paper elevation={2}>
        <TableContainer
         sx={{ 
            maxHeight: 500,           // Set max height
            overflow: 'auto',         // Enable scrolling
            '& .MuiTableHead-root': { // Keep headers sticky
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1
            }
          }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <InventoryRowSkeleton key={index} />
                ))
              ) : inventory.length > 0 ? (
                // Show actual inventory data
                inventory.map((item) => {
                  const status = getStockStatus(item);
                  const stockPercentage = getStockPercentage(item);
                  
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              {item.quantity}/{item.maxCapacity || 'N/A'}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={stockPercentage}
                            color={status.color}
                            sx={{ mt: 0.5 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            Min: {item.minThreshold}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="right">
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuClick(e, item)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                // Show empty state
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No inventory items found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditItem(selectedItem)}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText primary="Edit Item" />
        </MenuItem>
        <MenuItem onClick={() => handleRestock(selectedItem)}>
          <ListItemIcon><Add /></ListItemIcon>
          <ListItemText primary="Restock Item" />
        </MenuItem>
        <MenuItem onClick={() => handleDeleteItem(selectedItem)} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete color="error" /></ListItemIcon>
          <ListItemText primary="Delete Item" />
        </MenuItem>
      </Menu>

      {/* ADD ITEM DIALOG */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Inventory Item
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                placeholder="Enter item name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Current Stock"
                type="number"
                placeholder="Enter current stock quantity"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Minimum Threshold"
                type="number"
                placeholder="Enter minimum stock threshold"
                value={formData.minThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, minThreshold: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmit(false)} 
            variant="contained"
            disabled={submitting || !formData.name || !formData.quantity || !formData.minThreshold}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Adding...' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT ITEM DIALOG */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Inventory Item
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                placeholder={selectedItem?.name || "Item name"}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Current Stock"
                type="number"
                placeholder={selectedItem?.quantity?.toString() || "Current stock"}
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
                helperText={`Current: ${selectedItem?.quantity || 0} units`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Minimum Threshold"
                type="number"
                placeholder={selectedItem?.minThreshold?.toString() || "Minimum threshold"}
                value={formData.minThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, minThreshold: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
                helperText={`Current: ${selectedItem?.minThreshold || 0} units`}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmit(true)} 
            variant="contained"
            disabled={submitting || !formData.name || !formData.quantity || !formData.minThreshold}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Updating...' : 'Update Item'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete Inventory Item
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the following inventory item? This action cannot be undone.
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {selectedItem?.name || 'Unknown Item'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Current Stock: {selectedItem?.quantity || 0} units
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Min Threshold: {selectedItem?.minThreshold || 0} units
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <Delete />}
          >
            {submitting ? 'Deleting...' : 'Delete Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InventoryOverview;
