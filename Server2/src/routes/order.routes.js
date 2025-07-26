const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus, updateOrderStage, deleteOrder } = require('../controllers/order.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// router.get('/orders', authenticateToken, getOrders);
// router.post('/orders', authenticateToken, createOrder);
// router.patch('/orders/:id/status', authenticateToken, updateOrderStatus);
// router.patch('/orders/:id/stage', authenticateToken, updateOrderStage);
// router.delete('/orders/:id', authenticateToken, requireRole('admin'), deleteOrder);

router.get('/', getOrders);
router.post('/',  createOrder);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/stage', updateOrderStage);
router.delete('/:id', deleteOrder);

module.exports = router;