import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Alert,
  CircularProgress,
  Skeleton,
  ListItem
} from '@mui/material';
import {
  Add,
  LocalDining,
  Edit,
  Delete,
  MoreVert,
  Refresh
} from '@mui/icons-material';
import adminApiService from '../../services/admin/adminApiService';

function ProductCardSkeleton() {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="text" width={120} height={32} />
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Skeleton variant="text" width={60} height={40} />
          <Skeleton variant="text" width={60} height={40} />
        </Box>
        <Skeleton variant="text" width={100} />
      </CardContent>
    </Card>
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with product name */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
              <LocalDining />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              {product.name}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Product stats */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Quantity
            </Typography>
            <Typography variant="h6" color="primary">
              {product.quantity}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Price (RON)
            </Typography>
            <Typography variant="h6" color="primary">
              {product.price}
            </Typography>
          </Box>
        </Box>

        {/* Last updated */}
        {product.updatedAt && (
          <Typography variant="caption" color="textSecondary">
            Updated: {new Date(product.updatedAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>

      <Divider />

      {/* Action menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onEdit(product); handleMenuClose(); }}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText primary="Edit Product" />
        </MenuItem>
        <MenuItem onClick={() => { onDelete(product); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete color="error" /></ListItemIcon>
          <ListItemText primary="Delete Product" />
        </MenuItem>
      </Menu>
    </Card>
  );
}

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Separate dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form data matching Product model
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle add new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      price: '',
      quantity: ''
    });
    setAddDialogOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setEditDialogOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (isEdit = false) => {
    try {
      setSubmitting(true);
      setError(null);

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0
      };

      if (isEdit) {
        const updatedProduct = await adminApiService.updateProduct(selectedProduct.id, productData);
        setProducts(prev => prev.map(product => 
          product.id === selectedProduct.id ? updatedProduct : product
        ));
        setEditDialogOpen(false);
      } else {
        const newProduct = await adminApiService.createProduct(productData);
        setProducts(prev => [...prev, newProduct]);
        setAddDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      await adminApiService.deleteProduct(selectedProduct.id);
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <Box>
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
            Product Catalog
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage products and inventory
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleAddProduct}
          >
            Add New Product
          </Button>
        </Box>
      </Box>

      {/* Products grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No products found
          </Typography>
        </Paper>
      )}

      {/* ADD PRODUCT DIALOG */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Product
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price (RON)"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
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
            disabled={submitting || !formData.name || !formData.price || !formData.quantity}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Adding...' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT PRODUCT DIALOG */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Product
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                placeholder={selectedProduct?.name || "Product name"}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price (RON)"
                type="number"
                placeholder={selectedProduct?.price?.toString() || "Price"}
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
                helperText={`Current: ${selectedProduct?.price || 0} RON`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                placeholder={selectedProduct?.quantity?.toString() || "Quantity"}
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
                helperText={`Current: ${selectedProduct?.quantity || 0} units`}
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
            disabled={submitting || !formData.name || !formData.price || !formData.quantity}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Updating...' : 'Update Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete Product
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the following product? This action cannot be undone.
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {selectedProduct?.name || 'Unknown Product'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Price: {selectedProduct?.price || 0} RON
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quantity: {selectedProduct?.quantity || 0} units
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
            {submitting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductCatalog;
