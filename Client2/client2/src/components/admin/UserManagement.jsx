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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  Delete,
  MoreVert,
  Refresh
} from '@mui/icons-material';

// Import the Admin API service for backend communication
import adminApiService from '../../services/admin/adminApiService';

// Available user roles in the system
const userRoles = [
  'Factory Worker',
  'Packaging Worker', 
  'Admin'
];

/**
 * Skeleton component for loading state - shows placeholder rows while data is being fetched
 */
function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Box display="flex" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box>
            <Skeleton variant="text" width={120} />
          </Box>
        </Box>
      </TableCell>
      <TableCell><Skeleton variant="text" width={80} /></TableCell>
      <TableCell align="right"><Skeleton variant="circular" width={24} height={24} /></TableCell>
    </TableRow>
  );
}

/**
 * Main UserManagement component for CRUD operations on users
 */
function UserManagement() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Separate dialog states for different operations
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data for add/edit operations
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // USER OPERATIONS (ADD/EDIT/DELETE)
  // ============================================================================
  
  /**
   * Open add user dialog with empty form
   */
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({ username: '', password: '', role: '' });
    setAddDialogOpen(true);
  };

  /**
   * Open edit user dialog with current user data
   */
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.name, // Map user.name to username for the form
      role: user.role,
      password: '' // Always empty for security
    });
    setEditDialogOpen(true);
    setMenuAnchor(null);
  };

  /**
   * Open delete confirmation dialog
   */
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  /**
   * Handle form submission for add/edit operations
   */
  const handleSubmit = async (isEdit = false) => {
    try {
      setSubmitting(true);
      setError(null);

      if (isEdit) {
        // Update existing user
        const updatedUser = await adminApiService.updateUser(selectedUser.id, formData);
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...updatedUser }
            : user
        ));
        setEditDialogOpen(false);
      } else {
        // Create new user
        const newUser = await adminApiService.createUser(formData);
        setUsers(prev => [...prev, newUser]);
        setAddDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to save user:', err);
      setError('Failed to save user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle user deletion
   */
  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      await adminApiService.deleteUser(selectedUser.id);
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // CONTEXT MENU OPERATIONS
  // ============================================================================
  
  const handleMenuClick = (event, user) => {
    setSelectedUser(user);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  const handleRefresh = () => {
    fetchUsers();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'factory_worker':
        return 'primary';
      case 'packaging_worker':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            User Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage system users and their permissions
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button 
            variant="contained" 
            startIcon={<PersonAdd />}
            onClick={handleAddUser}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <UserRowSkeleton key={index} />
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {user.username}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={user.role}
                        size="small"
                        color={getRoleColor(user.role)}
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuClick(e, user)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditUser(selectedUser)}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText primary="Edit User" />
        </MenuItem>
        
        <MenuItem onClick={() => handleDeleteUser(selectedUser)} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete color="error" /></ListItemIcon>
          <ListItemText primary="Delete User" />
        </MenuItem>
      </Menu>

      {/* ADD USER DIALOG */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New User
        </DialogTitle>
        
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              placeholder="Enter user's full name"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              fullWidth
              required
              disabled={submitting}
            />
            
            <TextField
              label="Role"
              select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              fullWidth
              required
              disabled={submitting}
              placeholder="Select user role"
            >
              {userRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Password"
              type="password"
              placeholder="Enter a secure password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
              required
              disabled={submitting}
              helperText="Password must be at least 8 characters long"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmit(false)} 
            variant="contained"
            disabled={submitting || !formData.username || !formData.role || !formData.password}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT USER DIALOG */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit User
        </DialogTitle>
        
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              // Show current name as placeholder when editing
              placeholder={selectedUser?.username || "User's full name"}
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              fullWidth
              required
              disabled={submitting}
            />
            
            <TextField
              label="Role"
              select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              fullWidth
              required
              disabled={submitting}
              // Show current role in helper text
              helperText={`Current role: ${selectedUser?.role || 'Unknown'}`}
            >
              {userRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="New Password"
              type="password"
              placeholder="Leave empty to keep current password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
              disabled={submitting}
              helperText="Only fill if you want to change the password"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmit(true)} 
            variant="contained"
            disabled={submitting || !formData.username || !formData.role}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE USER DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete User
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the following user? This action cannot be undone.
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
              {selectedUser?.avatar || selectedUser?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {selectedUser?.name || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Role: {selectedUser?.role || 'Unknown'}
              </Typography>
            </Box>
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
            {submitting ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;  