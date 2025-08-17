// // 📁 src/routes/rawMaterial.routes.js
// const express = require('express');
// const router = express.Router();
// const { getIngredient, createIngredient, deleteIngredient,updateIngredient } = require('../controllers/ingredient.controller');
// const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// // router.get('/raw-Ingredient', authenticateToken, getRawIngredient);
// // router.post('/raw-Ingredient', authenticateToken, requireRole('admin'), createRawMaterial);
// // router.delete('/raw-Ingredient/:id', authenticateToken, requireRole('admin'), deleteRawMaterial);


// router.get('/', getIngredient);
// router.post('/', createIngredient);
// router.delete('/:id', deleteIngredient);
// router.put('/:id', updateIngredient);


// module.exports = router;

// routes/ingredient.routes.js
const express = require('express');
const router = express.Router();
const { getIngredient, createIngredient, deleteIngredient, updateIngredient } = require('../controllers/ingredient.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, getIngredient); // All authenticated users
router.post('/', authenticateToken, requireRole('admin'), createIngredient);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteIngredient);
router.put('/:id', authenticateToken, requireRole('admin'), updateIngredient);

module.exports = router;