const express = require('express');
const router = express.Router();
const { 
  getRecipes, 
  getRecipeById, 
  getRecipesByProduct, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe
} = require('../controllers/recipe.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// router.get('/recipes', authenticateToken, getRecipes);
// router.post('/recipes', authenticateToken, createRecipe);
// router.put('/recipes/:id', authenticateToken, updateRecipe);
// router.get('/recipes/:id', authenticateToken, getRecipeById);
// router.delete('/recipes/:id', authenticateToken, requireRole('admin'), deleteRecipe);

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.get('/product/:productId', getRecipesByProduct);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;