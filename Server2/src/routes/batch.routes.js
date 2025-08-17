// const express = require('express');
// const router = express.Router();
// const { getBatches, createBatch, updateBatch, deleteBatch, getBatch } = require('../controllers/batch.controller');
// const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// // router.get('/Batchs', authenticateToken, getBatchs);
// // router.post('/Batchs', authenticateToken, createBatch);
// // router.patch('/Batchs/:id/status', authenticateToken, updateBatchStatus);
// // router.patch('/Batchs/:id/stage', authenticateToken, updateBatchStage);
// // router.delete('/Batchs/:id', authenticateToken, requireRole('admin'), deleteBatch);

// router.get('/', getBatches);
// router.get('/:id', getBatch)
// router.post('/',  createBatch);
// router.patch('/:id', updateBatch);
// router.delete('/:id', deleteBatch);

// module.exports = router;

// routes/batch.routes.js
const express = require('express');
const router = express.Router();
const { getBatches, createBatch, updateBatch, deleteBatch, getBatch } = require('../controllers/batch.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, requireRole('admin', 'factory'), getBatches);
router.get('/:id', authenticateToken, requireRole('admin', 'factory'), getBatch);
router.post('/', authenticateToken, requireRole('admin'), createBatch);
router.patch('/:id', authenticateToken, requireRole('admin', 'factory'), updateBatch);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteBatch);

module.exports = router;

