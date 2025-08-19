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

const express = require('express');
const router = express.Router();
const { getBatches, createBatch, updateBatch, deleteBatch, getBatch } = require('../controllers/batch.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, authorizeRole(['admin', 'factory', 'packaging']), getBatches);
router.get('/:id', authenticateToken, authorizeRole(['admin', 'factory', 'packaging']), getBatch);
router.post('/', authenticateToken, authorizeRole(['admin']), createBatch);
router.patch('/:id', authenticateToken, authorizeRole(['admin', 'factory', 'packaging']), updateBatch);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteBatch);

module.exports = router;