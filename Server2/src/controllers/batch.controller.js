// 📁 src/controllers/batch.controller.js
const { Batch, Product } = require('../models/index.model');
const logger = require('../utils/logger');

const getBatches = async (req, res) => {
 logger.log('[GET BATCHES] Attempting to fetch all Batches...');
 try {
   const batches = await Batch.findAll({
     include: [{
       model: Product,
       attributes: ['id', 'name'] // Include product details you want
     }]
   });
   logger.log(`[GET BATCHES] Fetched ${batches.length} Batch(s).`);
   res.json(batches);
 } catch (err) {
   logger.error('[GET BATCHES] Error:', err);
   res.status(500).json({ message: 'Error fetching batches' });
 }
};

// GET /api/batches/:id
const getBatch = async (req, res) => {
  const { id } = req.params;
  logger.log(`[GET BATCH BY ID] Attempting to fetch batch ${id}`);

  try {
    const batch = await Batch.findByPk(id);

    if (!batch) {
      logger.log(`[GET BATCH BY ID] Batch ${id} not found`);
      return res.status(404).json({ message: 'Batch not found' });
    }

    logger.log(`[GET BATCH BY ID] Successfully fetched Batch ${id} - productId: ${batch.productId}, stage: ${batch.stage}`);
    res.json(batch);

  } catch (err) {
    logger.error('[GET BATCH BY ID] Error:', err);
    res.status(500).json({ message: 'Error fetching Batch' });
  }

};

// POST /api/batches
const createBatch = async (req, res) => {
  const { productId } = req.body;
  logger.log(`[CREATE BATCH] Received: productId=${productId}`);
  try {
    const newBatch = await Batch.create({ productId, stage: 'due' });
    logger.log(`[CREATE BATCH] Created batch with ID: ${newBatch.id}, productId: ${productId}, stage: due`);
    res.status(201).json(newBatch);
  } catch (err) {
    logger.error('[CREATE BATCH] Error:', err);
    res.status(500).json({ message: 'Error creating batch' });
  }
};

// PATCH /batches/:id/status
const updateBatchStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  logger.log(`[UPDATE BATCH STATUS] Attempting to update batch ${id} with status: ${status}`);
  try {
    const batch = await Batch.findByPk(id);
    if (!batch) {
      logger.log(`[UPDATE BATCH STATUS] Batch ${id} not found`);
      return res.status(404).json({ message: 'Batch not found' });
    }

    const oldStatus = batch.status;
    batch.status = status;
    await batch.save();
    logger.log(`[UPDATE BATCH STATUS] Updated batch ${id} status from '${oldStatus}' to '${status}'`);
    res.json(batch);
  } catch (err) {
    logger.error('[UPDATE BATCH STATUS] Error:', err);
    res.status(500).json({ message: 'Error updating batch status' });
  }
};

// PATCH /batches/:id/stage
const updateBatchStage = async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  logger.log(`[UPDATE BATCH STAGE] Attempting to update batch ${id} to stage: ${stage}`);
  try {
    const batch = await Batch.findByPk(id);
    if (!batch) {
      logger.log(`[UPDATE BATCH STAGE] Batch ${id} not found`);
      return res.status(404).json({ message: 'Batch not found' });
    }

    const oldStage = batch.stage;
    batch.stage = stage;

    if (stage === 'done') {
      batch.finishedAt = new Date();
      logger.log(`[UPDATE BATCH STAGE] Batch ${id} marked as completed, finishedAt set to: ${batch.finishedAt}`);
    }

    await batch.save();
    logger.log(`[UPDATE BATCH STAGE] Updated batch ${id} stage from '${oldStage}' to '${stage}'`);
    res.json(batch);
  } catch (err) {
    logger.error('[UPDATE BATCH STAGE] Error:', err);
    res.status(500).json({ message: 'Error updating batch stage' });
  }
};

// DELETE /batches/:id
const deleteBatch = async (req, res) => {
  const { id } = req.params;
  logger.log(`[DELETE BATCH] Attempting to delete batch ${id}`);
  try {
    const rowsDeleted = await Batch.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      logger.log(`[DELETE BATCH] Batch ${id} not found for deletion`);
      return res.status(404).json({ message: 'Batch not found' });
    }
    logger.log(`[DELETE BATCH] Successfully deleted batch ${id}`);
    res.sendStatus(204);
  } catch (err) {
    logger.error('[DELETE BATCH] Error:', err);
    res.status(500).json({ message: 'Error deleting batch' });
  }
};

module.exports = {
  getBatches,
  getBatch,
  createBatch,
  updateBatchStatus,
  updateBatchStage,
  deleteBatch
};
