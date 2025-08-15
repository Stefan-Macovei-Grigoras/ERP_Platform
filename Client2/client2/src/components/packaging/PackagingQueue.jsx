// components/packaging/PackagingQueue.jsx
import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  MoreVert,
  Assignment,
  CheckCircle,
  Refresh,
  Person,
  Pause
} from '@mui/icons-material';
import packagingApiService from '../../services/packaging/packagingApiService';

function PackagingQueue({ 
  batches, 
  onStartPackaging, 
  onCompletePackaging, 
  onRefresh, 
  loading, 
  error,
  currentUser 
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [packagingData, setPackagingData] = useState({
    packagesCount: '',
    notes: ''
  });

  const handleMenuClick = (event, batch) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBatch(batch);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBatch(null);
  };

  const handleStartPackaging = async () => {
    if (selectedBatch) {
      await onStartPackaging(selectedBatch.id, currentUser.id);
      handleMenuClose();
    }
  };

  const handlePausePackaging = async () => {
    if (selectedBatch) {
      try {
        await packagingApiService.pausePackaging(selectedBatch.id, 'User requested pause');
        await onRefresh();
        handleMenuClose();
      } catch (err) {
        console.error('Failed to pause packaging:', err);
      }
    }
  };

  const handleCompletePackaging = async () => {
    if (selectedBatch) {
      await onCompletePackaging(selectedBatch.id, {
        packagesCount: parseInt(packagingData.packagesCount),
        notes: packagingData.notes
      });
      setCompleteDialogOpen(false);
      setPackagingData({ packagesCount: '', notes: '' });
      handleMenuClose();
    }
  };

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'ready_for_packaging':
        return 'warning';
      case 'packaging':
        return 'info';
      case 'packaged':
        return 'success';
      case 'paused':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAvailableActions = (batch) => {
    const actions = [];
    
    switch (batch.stage) {
      case 'ready_for_packaging':
        actions.push({
          icon: <PlayArrow />,
          label: 'Start Packaging',
          action: 'start'
        });
        break;
      case 'packaging':
        if (batch.assignedWorkerId === currentUser.id) {
          actions.push({
            icon: <CheckCircle />,
            label: 'Complete Packaging',
            action: 'complete'
          });
          actions.push({
            icon: <Pause />,
            label: 'Pause Packaging',
            action: 'pause'
          });
        }
        break;
      case 'paused':
        actions.push({
          icon: <PlayArrow />,
          label: 'Resume Packaging',
          action: 'start'
        });
        break;
    }
    
    return actions;
  };

  const executeAction = (action) => {
    switch (action) {
      case 'start':
        handleStartPackaging();
        break;
      case 'complete':
        setCompleteDialogOpen(true);
        handleMenuClose();
        break;
      case 'pause':
        handlePausePackaging();
        break;
    }
  };

  return (
    <Paper elevation={2}>
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

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
            {batches.length} batches in queue
          </Typography>
        </Box>
        <IconButton onClick={onRefresh} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Batch</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Worker</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.length > 0 ? (
              batches.map((batch) => (
                <TableRow key={batch.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{batch.id}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {batch.productName || `Product #${batch.productId}`}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Badge
                      color={getStageColor(batch.stage)}
                      variant="dot"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">
                      {batch.stage?.replace('_', ' ')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" color="disabled" />
                      <Typography variant="body2">
                        {batch.assignedWorkerName || 'Unassigned'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {batch.startedAt 
                        ? `${Math.floor((Date.now() - new Date(batch.startedAt)) / 60000)}m`
                        : 'Not started'
                      }
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuClick(e, batch)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No batches in packaging queue
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedBatch && getAvailableActions(selectedBatch).map((action, index) => (
          <MenuItem key={index} onClick={() => executeAction(action.action)}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Complete Packaging Dialog */}
      <Dialog 
        open={completeDialogOpen} 
        onClose={() => setCompleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complete Packaging</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Number of Packages"
              type="number"
              value={packagingData.packagesCount}
              onChange={(e) => setPackagingData(prev => ({ 
                ...prev, 
                packagesCount: e.target.value 
              }))}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Notes (Optional)"
              multiline
              rows={3}
              value={packagingData.notes}
              onChange={(e) => setPackagingData(prev => ({ 
                ...prev, 
                notes: e.target.value 
              }))}
              fullWidth
              placeholder="Add any notes about the packaging process..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCompletePackaging}
            variant="contained"
            disabled={!packagingData.packagesCount}
          >
            Complete Packaging
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default PackagingQueue;