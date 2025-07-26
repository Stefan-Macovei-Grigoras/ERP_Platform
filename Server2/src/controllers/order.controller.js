// 📁 src/controllers/order.controller.js
const { Order } = require('../models/index.model');

// GET /api/orders
const getOrders = async (req, res) => {
  console.log('[GET ORDERS] Fetching order list...');
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error('[GET ORDERS] Error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};


// POST /api/orders
const createOrder = async (req, res) => {
  const { productId } = req.body;
  try {
    const newOrder = await Order.create({ productId, stage: 'due' });
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Optional if you want to support custom status
  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// PATCH /api/orders/:id/stage
const updateOrderStage = async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.stage = stage;
    if (stage === 'done') order.finishedAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order stage' });
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await Order.destroy({ where: { id } });
    if (rowsDeleted === 0) return res.status(404).json({ message: 'Order not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order' });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  updateOrderStage,
  deleteOrder
};
