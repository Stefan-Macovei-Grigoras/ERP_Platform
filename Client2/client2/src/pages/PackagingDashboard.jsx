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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip
} from '@mui/material';
import {
  Refresh,
  MoreVert,
  PlayArrow,
  CheckCircle,
  LocalShipping,
  Assignment
} from '@mui/icons-material';
import adminApiService from '.././services/admin/adminApiService';

function PackagingRowSkeleton() {
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

function PackagingDashboard() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
    fetchProducts();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getBatches();
      
      // Filter batches for packaging workflow: 'end-processing' and 'packaging' stages
      const packagingBatches = data.filter(batch => 
        batch.stage === 'end-processing' || batch.stage === 'packaging'
      );
      
      console.log('All batches:', data);
      console.log('Packaging batches:', packagingBatches);
      
      setBatches(packagingBatches);
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

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  // Stage color mapping
  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'end-processing':
        return 'warning';
      case 'packaging':
        return 'info';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  // Stage display name
  const getStageDisplayName = (stage) => {
    switch (stage) {
      case 'end-processing':
        return 'Ready for Packaging';
      case 'packaging':
        return 'Packaging in Progress';
      case 'done':
        return 'Completed';
      default:
        return stage;
    }
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
        case 'start_packaging':
          // Move from 'end-processing' to 'packaging'
          await adminApiService.updateBatch(selectedBatch.id, { stage: 'packaging' });
          console.log(`Started packaging for batch ${selectedBatch.id}`);
          break;
        case 'finish_packaging':
          // Move from 'packaging' to 'done'
           await adminApiService.updateBatch(selectedBatch.id, { stage: 'done' });
          console.log(`Completed packaging for batch ${selectedBatch.id}`);
          break;
        default:
          break;
      }
      
      // Refresh data after action
      await fetchBatches();
      
    } catch (err) {
      console.error('Failed to execute batch action:', err);
      setError(`Failed to execute action: ${err.message}`);
    }
    
    handleMenuClose();
  };

  // Get available actions based on batch stage
  const getAvailableActions = (batch) => {
    const actions = [];
    
    switch (batch.stage) {
      case 'end-processing':
        actions.push({
          icon: <LocalShipping />,
          label: 'Start Packaging',
          action: 'start_packaging'
        });
        break;
      case 'packaging':
        actions.push({
          icon: <CheckCircle />,
          label: 'Finish Packaging',
          action: 'finish_packaging'
        });
        break;
    }
    
    return actions;
  };

  const handleRefresh = () => {
    fetchBatches();
  };

  // Count batches by stage
  const readyForPackagingCount = batches.filter(b => b.stage === 'end-processing').length;
  const packagingInProgressCount = batches.filter(b => b.stage === 'packaging').length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Page Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Packaging Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage batch packaging operations
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box display="flex" gap={2} mb={3}>
        <Chip 
          label={`${readyForPackagingCount} Ready for Packaging`} 
          color="warning" 
          variant="outlined"
          icon={<Assignment />}
        />
        <Chip 
          label={`${packagingInProgressCount} Currently Packaging`} 
          color="info" 
          variant="outlined"
          icon={<LocalShipping />}
        />
      </Box>

      {/* Batches Table */}
      <Paper elevation={2}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Packaging Queue
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {batches.length} batches in packaging workflow
            </Typography>
          </Box>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Batch ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Processing Completed</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <PackagingRowSkeleton key={index} />
                ))
              ) : batches.length > 0 ? (
                // Show actual batch data
                batches.map((batch) => (
                  <TableRow key={batch.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        #{batch.id}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {batch.Product?.name || getProductName(batch.productId)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {batch.productId}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Badge
                        color={getStageColor(batch.stage)}
                        variant="dot"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {getStageDisplayName(batch.stage)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {batch.processingCompletedAt 
                          ? new Date(batch.processingCompletedAt).toLocaleDateString()
                          : batch.finishedAt 
                          ? new Date(batch.finishedAt).toLocaleDateString()
                          : new Date(batch.createdAt).toLocaleDateString()
                        }
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {batch.processingCompletedAt 
                          ? new Date(batch.processingCompletedAt).toLocaleTimeString()
                          : batch.finishedAt 
                          ? new Date(batch.finishedAt).toLocaleTimeString()
                          : 'N/A'
                        }
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      {getAvailableActions(batch).length > 0 ? (
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuClick(e, batch)}
                        >
                          <MoreVert />
                        </IconButton>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Complete
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Show empty state
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No batches ready for packaging
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Batches will appear here when production is completed (end-processing stage)
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedBatch && getAvailableActions(selectedBatch).map((action, index) => (
          <MenuItem 
            key={index}
            onClick={() => handleBatchAction(action.action)}
          >
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText 
              primary={action.label}
              secondary={
                action.action === 'start_packaging' 
                  ? 'Move to packaging stage'
                  : 'Complete and mark as done'
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default PackagingDashboard;

