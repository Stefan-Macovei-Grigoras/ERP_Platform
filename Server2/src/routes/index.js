// //routes/index.js
// const express = require('express');
// const router = express.Router();

// const userRoutes = require('./user.routes');
// const productRoutes = require('./product.routes');
// const ingredientRoutes = require('./ingredient.routes');
// const batchRoutes = require('./batch.routes');
// const loginController  = require('../controllers/loginController');
// const recipeRoutes = require('./recipe.routes');

// router.post('/login', loginController.login); 
// router.use('/user', userRoutes);
// router.use('/product', productRoutes);
// router.use('/ingredient', ingredientRoutes);
// router.use('/batch', batchRoutes);
// router.use('/recipe', recipeRoutes);

// module.exports = router;
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 9, // Allow 5 login attempts per IP per 15 minutes
  message:
    'Too many failed login attempts from this IP, please try again after 15 minutes.',
});

const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const ingredientRoutes = require('./ingredient.routes');
const batchRoutes = require('./batch.routes');
const loginController = require('../controllers/loginController');
const recipeRoutes = require('./recipe.routes');

router.post('/login',loginLimiter, loginController.login);
router.get('/verify-token', loginController.verifyToken);

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/ingredient', ingredientRoutes);
router.use('/batch', batchRoutes);
router.use('/recipe', recipeRoutes);

module.exports = router;