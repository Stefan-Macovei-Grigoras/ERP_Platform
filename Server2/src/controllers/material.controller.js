// 📁 src/controllers/rawMaterial.controller.js
const { Material } = require('../models/index.model');

// GET /materials
const getMaterials = async (req, res) => {
  console.log('[GET MATERIALS] Attempting to fetch all raw materials...');
  try {
    const materials = await Material.findAll();
    console.log(`[GET MATERIALS] Fetched ${materials.length} material(s).`);
    res.json(materials);
  } catch (err) {
    console.error('[GET MATERIALS] Error:', err);
    res.status(500).json({ message: 'Error fetching raw materials' });
  }
};

// POST /materials
const createMaterial = async (req, res) => {
  const { name, quantity, minThreshold, unit } = req.body;
  console.log(`[CREATE MATERIAL] Received: name=${name}, quantity=${quantity}, minThreshold=${minThreshold}, unit=${unit}`);
  try {
    const newMaterial = await Material.create({ name, quantity, minThreshold, unit });
    console.log('[CREATE MATERIAL] Created:', newMaterial.id);
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error('[CREATE MATERIAL] Error:', err);
    res.status(500).json({ message: 'Error creating raw material' });
  }
};

// DELETE /materials/:id
const deleteMaterial = async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE MATERIAL] Trying to delete id=${id}`);
  try {
    const rowsDeleted = await Material.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      console.warn(`[DELETE MATERIAL] Not found: id=${id}`);
      return res.status(404).json({ message: 'Raw material not found' });
    }
    console.log(`[DELETE MATERIAL] Deleted id=${id}`);
    res.sendStatus(204);
  } catch (err) {
    console.error('[DELETE MATERIAL] Error:', err);
    res.status(500).json({ message: 'Error deleting raw material' });
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  deleteMaterial
};
