// 📁 src/routes/rawMaterial.routes.js
const express = require('express');
const router = express.Router();
const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/material.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// router.get('/raw-materials', authenticateToken, getRawMaterials);
// router.post('/raw-materials', authenticateToken, requireRole('admin'), createRawMaterial);
// router.delete('/raw-materials/:id', authenticateToken, requireRole('admin'), deleteRawMaterial);


router.get('/', getMaterials);
router.post('/', createMaterial);
router.delete('/:id', deleteMaterial);


module.exports = router;