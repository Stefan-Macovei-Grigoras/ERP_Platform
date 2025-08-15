//routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const ingredientRoutes = require('./ingredient.routes');
const batchRoutes = require('./batch.routes');
const loginController  = require('../controllers/loginController');
const recipeRoutes = require('./recipe.routes');

router.post('/login', loginController.login); 
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/ingredient', ingredientRoutes);
router.use('/batch', batchRoutes);
router.use('/recipe', recipeRoutes);

module.exports = router;
