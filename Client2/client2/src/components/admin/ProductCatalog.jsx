// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Avatar,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   LinearProgress,
//   Alert,
//   CircularProgress,
//   Skeleton,
//   ListItem
// } from '@mui/material';
// import {
//   Add,
//   LocalDining,
//   Edit,
//   Delete,
//   MoreVert,
//   Refresh
// } from '@mui/icons-material';
// import adminApiService from '../../services/admin/adminApiService';

// function ProductCardSkeleton() {
//   return (
//     <Card elevation={2} sx={{ height: '100%' }}>
//       <CardContent>
//         <Box display="flex" alignItems="center" gap={2} mb={2}>
//           <Skeleton variant="circular" width={48} height={48} />
//           <Skeleton variant="text" width={120} height={32} />
//         </Box>
//         <Box display="flex" justifyContent="space-between" mb={2}>
//           <Skeleton variant="text" width={60} height={40} />
//           <Skeleton variant="text" width={60} height={40} />
//         </Box>
//         <Skeleton variant="text" width={100} />
//       </CardContent>
//     </Card>
//   );
// }

// function ProductCard({ product, onEdit, onDelete }) {
//   const [menuAnchor, setMenuAnchor] = useState(null);

//   const handleMenuClick = (event) => {
//     setMenuAnchor(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//   };

//   return (
//     <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <CardContent sx={{ flexGrow: 1 }}>
//         {/* Header with product name */}
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
//               <LocalDining />
//             </Avatar>
//             <Typography variant="h6" fontWeight="bold">
//               {product.name}
//             </Typography>
//           </Box>
//           <IconButton size="small" onClick={handleMenuClick}>
//             <MoreVert />
//           </IconButton>
//         </Box>

//         {/* Product stats */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Box>
//             <Typography variant="caption" color="textSecondary">
//               Quantity
//             </Typography>
//             <Typography variant="h6" color="primary">
//               {product.quantity}
//             </Typography>
//           </Box>
//           <Box>
//             <Typography variant="caption" color="textSecondary">
//               Price (RON)
//             </Typography>
//             <Typography variant="h6" color="primary">
//               {product.price}
//             </Typography>
//           </Box>
//         </Box>

//         {/* Last updated */}
//         {product.updatedAt && (
//           <Typography variant="caption" color="textSecondary">
//             Updated: {new Date(product.updatedAt).toLocaleDateString()}
//           </Typography>
//         )}
//       </CardContent>

//       <Divider />

//       {/* Action menu */}
//       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//         <MenuItem onClick={() => { onEdit(product); handleMenuClose(); }}>
//           <ListItemIcon><Edit /></ListItemIcon>
//           <ListItemText primary="Edit Product" />
//         </MenuItem>
//         <MenuItem onClick={() => { onDelete(product); handleMenuClose(); }} sx={{ color: 'error.main' }}>
//           <ListItemIcon><Delete color="error" /></ListItemIcon>
//           <ListItemText primary="Delete Product" />
//         </MenuItem>
//       </Menu>
//     </Card>
//   );
// }

// function ProductCatalog() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
  
//   // Separate dialog states
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
  
//   // Form data matching Product model
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     quantity: ''
//   });

//   // Fetch products on component mount
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await adminApiService.getProducts();
//       setProducts(data);
//     } catch (err) {
//       console.error('Failed to fetch products:', err);
//       setError('Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle add new product
//   const handleAddProduct = () => {
//     setSelectedProduct(null);
//     setFormData({
//       name: '',
//       price: '',
//       quantity: ''
//     });
//     setAddDialogOpen(true);
//   };

//   // Handle edit product
//   const handleEditProduct = (product) => {
//     setSelectedProduct(product);
//     setFormData({
//       name: product.name,
//       price: product.price.toString(),
//       quantity: product.quantity.toString()
//     });
//     setEditDialogOpen(true);
//   };

//   // Handle delete product
//   const handleDeleteProduct = (product) => {
//     setSelectedProduct(product);
//     setDeleteDialogOpen(true);
//   };

//   // Handle form submission
//   const handleSubmit = async (isEdit = false) => {
//     try {
//       setSubmitting(true);
//       setError(null);

//       const productData = {
//         name: formData.name,
//         price: parseFloat(formData.price) || 0,
//         quantity: parseInt(formData.quantity) || 0
//       };

//       if (isEdit) {
//         const updatedProduct = await adminApiService.updateProduct(selectedProduct.id, productData);
//         setProducts(prev => prev.map(product => 
//           product.id === selectedProduct.id ? updatedProduct : product
//         ));
//         setEditDialogOpen(false);
//       } else {
//         const newProduct = await adminApiService.createProduct(productData);
//         setProducts(prev => [...prev, newProduct]);
//         setAddDialogOpen(false);
//       }
//     } catch (err) {
//       console.error('Failed to save product:', err);
//       setError('Failed to save product. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle delete confirmation
//   const handleConfirmDelete = async () => {
//     try {
//       setSubmitting(true);
//       setError(null);
      
//       await adminApiService.deleteProduct(selectedProduct.id);
//       setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
//       setDeleteDialogOpen(false);
//     } catch (err) {
//       console.error('Failed to delete product:', err);
//       setError('Failed to delete product. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchProducts();
//   };

//   return (
//     <Box>
//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Page header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h5" fontWeight="bold">
//             Product Catalog
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Manage products and inventory
//           </Typography>
//         </Box>
//         <Box display="flex" gap={1}>
//           <IconButton onClick={handleRefresh} disabled={loading}>
//             <Refresh />
//           </IconButton>
//           <Button 
//             variant="contained" 
//             startIcon={<Add />}
//             onClick={handleAddProduct}
//           >
//             Add New Product
//           </Button>
//         </Box>
//       </Box>

//       {/* Products grid */}
//       {loading ? (
//         <Grid container spacing={3}>
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <ProductCardSkeleton />
//             </Grid>
//           ))}
//         </Grid>
//       ) : products.length > 0 ? (
//         <Grid container spacing={3}>
//           {products.map((product) => (
//             <Grid item xs={12} sm={6} md={4} key={product.id}>
//               <ProductCard
//                 product={product}
//                 onEdit={handleEditProduct}
//                 onDelete={handleDeleteProduct}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
//           <Typography color="textSecondary">
//             No products found
//           </Typography>
//         </Paper>
//       )}

//       {/* ADD PRODUCT DIALOG */}
//       <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Add New Product
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Product Name"
//                 placeholder="Enter product name"
//                 value={formData.name}
//                 onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                 fullWidth
//                 required
//                 disabled={submitting}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Price (RON)"
//                 type="number"
//                 placeholder="Enter price"
//                 value={formData.price}
//                 onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
//                 fullWidth
//                 required
//                 disabled={submitting}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Quantity"
//                 type="number"
//                 placeholder="Enter quantity"
//                 value={formData.quantity}
//                 onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
//                 fullWidth
//                 required
//                 disabled={submitting}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAddDialogOpen(false)} disabled={submitting}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={() => handleSubmit(false)} 
//             variant="contained"
//             disabled={submitting || !formData.name || !formData.price || !formData.quantity}
//             startIcon={submitting ? <CircularProgress size={20} /> : null}
//           >
//             {submitting ? 'Adding...' : 'Add Product'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* EDIT PRODUCT DIALOG */}
//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Edit Product
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Product Name"
//                 placeholder={selectedProduct?.name || "Product name"}
//                 value={formData.name}
//                 onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                 fullWidth
//                 required
//                 disabled={submitting}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Price (RON)"
//                 type="number"
//                 placeholder={selectedProduct?.price?.toString() || "Price"}
//                 value={formData.price}
//                 onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
//                 fullWidth
//                 required
//                 disabled={submitting}
//                 helperText={`Current: ${selectedProduct?.price || 0} RON`}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Quantity"
//                 type="number"
//                 placeholder={selectedProduct?.quantity?.toString() || "Quantity"}
//                 value={formData.quantity}
//                 onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
//                 fullWidth
//                 required
//                 disabled={submitting}
//                 helperText={`Current: ${selectedProduct?.quantity || 0} units`}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)} disabled={submitting}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={() => handleSubmit(true)} 
//             variant="contained"
//             disabled={submitting || !formData.name || !formData.price || !formData.quantity}
//             startIcon={submitting ? <CircularProgress size={20} /> : null}
//           >
//             {submitting ? 'Updating...' : 'Update Product'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* DELETE CONFIRMATION DIALOG */}
//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
//         <DialogTitle sx={{ color: 'error.main' }}>
//           Delete Product
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             Are you sure you want to delete the following product? This action cannot be undone.
//           </Typography>
          
//           <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//             <Typography variant="body1" fontWeight="medium">
//               {selectedProduct?.name || 'Unknown Product'}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               Price: {selectedProduct?.price || 0} RON
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               Quantity: {selectedProduct?.quantity || 0} units
//             </Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleConfirmDelete}
//             variant="contained"
//             color="error"
//             disabled={submitting}
//             startIcon={submitting ? <CircularProgress size={20} /> : <Delete />}
//           >
//             {submitting ? 'Deleting...' : 'Delete Product'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default ProductCatalog;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
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
  Alert,
  CircularProgress,
  Skeleton
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

function ProductCard({ product, onEdit, onDelete, onRecipe }) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
              <LocalDining />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">{product.name}</Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="caption" color="textSecondary">Quantity</Typography>
            <Typography variant="h6" color="primary">{product.quantity}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Price (RON)</Typography>
            <Typography variant="h6" color="primary">{product.price}</Typography>
          </Box>
        </Box>

        {product.updatedAt && (
          <Typography variant="caption" color="textSecondary">
            Updated: {new Date(product.updatedAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>

      <Divider />

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onEdit(product); handleMenuClose(); }}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText primary="Edit Product" />
        </MenuItem>
        <MenuItem onClick={() => { onDelete(product); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete color="error" /></ListItemIcon>
          <ListItemText primary="Delete Product" />
        </MenuItem>
        <MenuItem onClick={() => { onRecipe(product); handleMenuClose(); }}>
          <ListItemIcon><LocalDining /></ListItemIcon>
          <ListItemText primary="Edit Recipe" />
        </MenuItem>
      </Menu>
    </Card>
  );
}

// ===================
// Recipe Dialog
// ===================
function RecipeDialog({ open, onClose, product }) {
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState({ name: "", duration: 0, temperature: 0, instructions: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && product) loadRecipe();
  }, [open, product]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getRecipeByProduct(product.id);
      const recipeObj = Array.isArray(data) ? data[0] : data; // fix here
      setRecipe(recipeObj);
      setSteps((recipeObj.steps && recipeObj.steps.steps) || []);
    } catch (err) {
      console.error("Failed to load recipe", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStep = (index, field, value) => {
    const copy = [...steps];
    copy[index] = { ...copy[index], [field]: value };
    setSteps(copy);
  };

  const handleDeleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    if (!newStep.name.trim()) return;
    setSteps([
      ...steps,
      {
        ...newStep,
        number: steps.length + 1,
        duration: parseInt(newStep.duration) || 0,
        temperature: parseInt(newStep.temperature) || 0
      }
    ]);
    setNewStep({ name: "", duration: 0, temperature: 0, instructions: "" });
  };

const handleSave = async () => {
  try {
    setSaving(true);
    await adminApiService.updateRecipe(recipe.id, {
      productId: recipe.productId,
      name: recipe.name,
      yield: recipe.yield,
      totalTime: recipe.totalTime,
      steps: steps  // Send only the steps array, not the entire recipe
    });
    onClose();
  } catch (err) {
    console.error("Failed to save recipe", err);
  } finally {
    setSaving(false);
  }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Recipe for {product?.name}</DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : (
          <Box>
            {/* LIST ALL STEPS */}
            {steps.map((step, i) => (
              <Box key={i} mb={1} p={1} border="1px solid #ddd" borderRadius={2}>
                <Typography variant="subtitle2">Step {i + 1}</Typography>
                <TextField
                  label="Name"
                  value={step.name}
                  onChange={(e) => handleUpdateStep(i, "name", e.target.value)}
                  fullWidth sx={{ mb: 1, mt: 1 }}
                />
                <TextField
                  label="Instructions"
                  value={step.instructions}
                  onChange={(e) => handleUpdateStep(i, "instructions", e.target.value)}
                  fullWidth sx={{ mb: 1 }}
                />
                <Box display="flex" gap={1} mb={0}>
                  <TextField
                    label="Duration (min)"
                    type="number"
                    value={step.duration}
                    onChange={(e) => handleUpdateStep(i, "duration", e.target.value)}
                  />
                  <TextField
                    label="Temperature (°C)"
                    type="number"
                    value={step.temperature}
                    onChange={(e) => handleUpdateStep(i, "temperature", e.target.value)}
                  />
                </Box>
                <Box display="flex" justifyContent="right" gap={1} mt = {-4}>
                  {/* <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUpdateStep(i, "number", i + 1)}
                  >
                    Update
                  </Button> */}
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteStep(i)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}

            {/* ADD NEW STEP */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Add New Step</Typography>
            <TextField
              label="Step Name"
              value={newStep.name}
              onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
              fullWidth sx={{ mb: 1 }}
            />
            <TextField
              label="Instructions"
              value={newStep.instructions}
              onChange={(e) => setNewStep({ ...newStep, instructions: e.target.value })}
              fullWidth sx={{ mb: 1 }}
            />
            <Box display="flex" gap={1} mb={2}>
              <TextField
                label="Duration (min)"
                type="number"
                value={newStep.duration}
                onChange={(e) => setNewStep({ ...newStep, duration: e.target.value })}
              />
              <TextField
                label="Temperature (°C)"
                type="number"
                value={newStep.temperature}
                onChange={(e) => setNewStep({ ...newStep, temperature: e.target.value })}
              />
            </Box>
            <Button onClick={handleAddStep} variant="contained">Add Step</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? "Saving..." : "Save Recipe"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({ name: '', price: '', quantity: '' });
    setAddDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleRecipe = (product) => {
    setSelectedProduct(product);
    setRecipeDialogOpen(true);
  };

  const handleSubmit = async (isEdit = false) => {
    try {
      setSubmitting(true);
      setError(null);
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0
      };
      // if (isEdit) {
      //   const updatedProduct = await adminApiService.updateProduct(selectedProduct.id, productData);
      //   console.log('Updated product:', updatedProduct); // Debug line
      //   setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      //   setEditDialogOpen(false);
      if (isEdit) {
        const response = await adminApiService.updateProduct(selectedProduct.id, productData);
        const updatedProduct = response.product; // Extract the actual product object
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        setEditDialogOpen(false);
      }
       else {
        const newProduct = await adminApiService.createProduct(productData);
        setProducts(prev => [...prev, newProduct]);
        setAddDialogOpen(false);
      }
    } catch (err) {
      setError('Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await adminApiService.deleteProduct(selectedProduct.id);
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // return (
  //   <Box>
  //     {error && (
  //       <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
  //         {error}
  //       </Alert>
  //     )}

  //     <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
  //       <Box>
  //         <Typography variant="h5" fontWeight="bold">Product Catalog</Typography>
  //         <Typography variant="body2" color="textSecondary">Manage products and inventory</Typography>
  //       </Box>
  //       <Box display="flex" gap={1}>
  //         <IconButton onClick={fetchProducts} disabled={loading}><Refresh /></IconButton>
  //         <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct}>Add New Product</Button>
  //       </Box>
  //     </Box>

  //     {loading ? (
  //       <Grid container spacing={3}>
  //         {Array.from({ length: 6 }).map((_, i) => (
  //           <Grid item xs={12} sm={6} md={4} key={i}><ProductCardSkeleton /></Grid>
  //         ))}
  //       </Grid>
  //     ) : products.length > 0 ? (
  //       <Grid container spacing={3}>
  //         {products.map((product) => (
  //           <Grid item xs={12} sm={6} md={4} key={product.id}>
  //             <ProductCard product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onRecipe={handleRecipe} />
  //           </Grid>
  //         ))}
  //       </Grid>
  //     ) : (
  //       <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
  //         <Typography color="textSecondary">No products found</Typography>
  //       </Paper>
  //     )}

  //     {/* existing Add/Edit/Delete dialogs remain here unchanged... */}

  //     <RecipeDialog
  //       open={recipeDialogOpen}
  //       onClose={() => setRecipeDialogOpen(false)}
  //       product={selectedProduct}
  //     />
  //   </Box>
  // );
  return (
  <Box>
    {error && (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
        {error}
      </Alert>
    )}

    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box>
        <Typography variant="h5" fontWeight="bold">Product Catalog</Typography>
        <Typography variant="body2" color="textSecondary">Manage products and inventory</Typography>
      </Box>
      <Box display="flex" gap={1}>
        <IconButton onClick={fetchProducts} disabled={loading}><Refresh /></IconButton>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct}>Add New Product</Button>
      </Box>
    </Box>

    {loading ? (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}><ProductCardSkeleton /></Grid>
        ))}
      </Grid>
    ) : products.length > 0 ? (
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onRecipe={handleRecipe} />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">No products found</Typography>
      </Paper>
    )}

    {/* ADD PRODUCT DIALOG */}
    <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
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
        <Button onClick={() => setAddDialogOpen(false)} disabled={submitting}>Cancel</Button>
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
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
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
        <Button onClick={() => setEditDialogOpen(false)} disabled={submitting}>Cancel</Button>
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
      <DialogTitle sx={{ color: 'error.main' }}>Delete Product</DialogTitle>
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
        <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>Cancel</Button>
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

    {/* RECIPE DIALOG */}
    <RecipeDialog
      open={recipeDialogOpen}
      onClose={() => setRecipeDialogOpen(false)}
      product={selectedProduct}
    />
  </Box>
);
}

export default ProductCatalog;

