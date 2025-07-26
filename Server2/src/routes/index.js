//routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const materialRoutes = require('./material.routes');
const orderRoutes = require('./order.routes');
const loginController  = require('../controllers/loginController');

router.post('/login', loginController.login); 
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/material', materialRoutes);
router.use('/order', orderRoutes);

module.exports = router;
