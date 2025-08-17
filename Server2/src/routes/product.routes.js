// // // 📁 src/routes/product.routes.js
// // const express = require('express');
// // const router = express.Router();
// // const { getProducts, createProduct, deleteProduct } = require('../controllers/product.controller');
// // const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// // router.get('/products', getProducts);
// // // router.get('/products', authenticateToken, getProducts);
// // router.post('/products', authenticateToken, requireRole('admin'), createProduct);
// // router.delete('/products/:id', authenticateToken, requireRole('admin'), deleteProduct);

// // module.exports = router;

// // 📁 src/routes/product.routes.js
// const express = require('express');
// const router = express.Router();
// const {
//   getProducts,
//   createProduct,
//   deleteProduct,
//   updateProduct
// } = require('../controllers/product.controller');

// // All routes are now public (no auth middleware)
// router.get('/', getProducts);
// router.post('/', createProduct);
// router.delete('/:id', deleteProduct);
// router.put('/:id',updateProduct)

// module.exports = router;


// routes/product.routes.js
const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct, updateProduct } = require('../controllers/product.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, getProducts); // All authenticated users
router.post('/', authenticateToken, requireRole('admin'), createProduct);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteProduct);
router.put('/:id', authenticateToken, requireRole('admin'), updateProduct);

module.exports = router;