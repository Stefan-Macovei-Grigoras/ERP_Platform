// // 📁 src/controllers/batch.controller.js
// const { Batch, Product } = require('../models/index.model');
// const logger = require('../utils/logger');

// const getBatches = async (req, res) => {
//  logger.log('[GET BATCHES] Attempting to fetch all Batches...');
//  try {
//    const batches = await Batch.findAll({
//      include: [{
//        model: Product,
//        attributes: ['id', 'name'] // Include product details you want
//      }]
//    });
//    logger.log(`[GET BATCHES] Fetched ${batches.length} Batch(s).`);
//    res.json(batches);
//  } catch (err) {
//    logger.error('[GET BATCHES] Error:', err);
//    res.status(500).json({ message: 'Error fetching batches' });
//  }
// };

// // GET /api/batches/:id
// const getBatch = async (req, res) => {
//   const { id } = req.params;
//   logger.log(`[GET BATCH BY ID] Attempting to fetch batch ${id}`);

//   try {
//     const batch = await Batch.findByPk(id);

//     if (!batch) {
//       logger.log(`[GET BATCH BY ID] Batch ${id} not found`);
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     logger.log(`[GET BATCH BY ID] Successfully fetched Batch ${id} - productId: ${batch.productId}, stage: ${batch.stage}`);
//     res.json(batch);

//   } catch (err) {
//     logger.error('[GET BATCH BY ID] Error:', err);
//     res.status(500).json({ message: 'Error fetching Batch' });
//   }

// };

// // POST /api/batches
// const createBatch = async (req, res) => {
//   const { productId } = req.body;
//   logger.log(`[CREATE BATCH] Received: productId=${productId}`);
//   try {
//     const newBatch = await Batch.create({ productId, stage: 'due' });
//     logger.log(`[CREATE BATCH] Created batch with ID: ${newBatch.id}, productId: ${productId}, stage: due`);
//     res.status(201).json(newBatch);
//   } catch (err) {
//     logger.error('[CREATE BATCH] Error:', err);
//     res.status(500).json({ message: 'Error creating batch' });
//   }
// };



// // PATCH /batches/:id - Flexible batch update endpoint
// const updateBatch = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;
  
//   logger.log(`[UPDATE BATCH] Attempting to update batch ${id} with data:`, updateData);
  
//   try {
//     const batch = await Batch.findByPk(id);
//     if (!batch) {
//       logger.log(`[UPDATE BATCH] Batch ${id} not found`);
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Store old values for logging
//     const oldValues = {};
//     Object.keys(updateData).forEach(key => {
//       oldValues[key] = batch[key];
//     });

//     // Update batch with provided data
//     Object.assign(batch, updateData);

//     // Auto-set finishedAt when stage is set to 'done'
//     if (updateData.stage === 'done' && !updateData.finishedAt) {
//       batch.finishedAt = new Date();
//       logger.log(`[UPDATE BATCH] Batch ${id} marked as completed, finishedAt auto-set to: ${batch.finishedAt}`);
//     }

//     await batch.save();
    
//     // Log what was changed
//     Object.keys(updateData).forEach(key => {
//       if (oldValues[key] !== updateData[key]) {
//         logger.log(`[UPDATE BATCH] Updated batch ${id} ${key} from '${oldValues[key]}' to '${updateData[key]}'`);
//       }
//     });

//     res.json(batch);
//   } catch (err) {
//     logger.error('[UPDATE BATCH] Error:', err);
//     res.status(500).json({ message: 'Error updating batch' });
//   }
// };

// // DELETE /batches/:id
// const deleteBatch = async (req, res) => {
//   const { id } = req.params;
//   logger.log(`[DELETE BATCH] Attempting to delete batch ${id}`);
//   try {
//     const rowsDeleted = await Batch.destroy({ where: { id } });
//     if (rowsDeleted === 0) {
//       logger.log(`[DELETE BATCH] Batch ${id} not found for deletion`);
//       return res.status(404).json({ message: 'Batch not found' });
//     }
//     logger.log(`[DELETE BATCH] Successfully deleted batch ${id}`);
//     res.sendStatus(204);
//   } catch (err) {
//     logger.error('[DELETE BATCH] Error:', err);
//     res.status(500).json({ message: 'Error deleting batch' });
//   }
// };

// module.exports = {
//   getBatches,
//   getBatch,
//   createBatch,
//   updateBatch,
//   deleteBatch
// };


// 📁 src/controllers/batch.controller.js
const { Batch, Product, Recipe } = require('../models/index.model');
const logger = require('../utils/logger');

const getBatches = async (req, res) => {
  logger.log('[GET BATCHES] Attempting to fetch all Batches...');
  try {
    const batches = await Batch.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'name'],
        include: [{
          model: Recipe, // Product.hasOne(Recipe)
          attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
        }]
      }],
      order: [['createdAt', 'DESC']]
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
    const batch = await Batch.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['id', 'name'],
        include: [{
          model: Recipe, // Product.hasOne(Recipe)
          attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
        }]
      }]
    });

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

// // POST /batches
// const createBatch = async (req, res) => {
//   const { productId, stage = 'due', expectedYield, notes = '' } = req.body;
//   logger.log(`[CREATE BATCH] Received: productId=${productId}, stage=${stage}`);
  
//   try {
//     // Validate productId is provided
//     if (!productId) {
//       return res.status(400).json({ message: 'productId is required' });
//     }

//     // Validate that product exists
//     const product = await Product.findByPk(productId, {
//       include: [{
//         model: Recipe,
//         attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
//       }]
//     });
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const batchData = {
//       productId,
//       stage,
//       notes,
//       ...(expectedYield && { expectedYield }),
//       // Set startedAt if stage is 'start-processing'
//       ...(stage === 'start-processing' && { startedAt: new Date() })
//     };

//     const newBatch = await Batch.create(batchData);
    
//     // Fetch created batch with includes
//     const createdBatch = await Batch.findByPk(newBatch.id, {
//       include: [{
//         model: Product,
//         attributes: ['id', 'name'],
//         include: [{
//           model: Recipe,
//           attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
//         }]
//       }]
//     });

//     logger.log(`[CREATE BATCH] Created batch with ID: ${newBatch.id}, productId: ${productId}, stage: ${stage}`);
//     res.status(201).json(createdBatch);
//   } catch (err) {
//     logger.error('[CREATE BATCH] Error:', err);
//     res.status(500).json({ message: 'Error creating batch' });
//   }
// };

// POST /batches
const createBatch = async (req, res) => {
  const { productId, stage = 'due', expectedYield, notes = '' } = req.body;
  logger.log(`[CREATE BATCH] Received: productId=${productId}, stage=${stage}`);
  
  try {
    // Validate productId is provided
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    // Validate that product exists
    const product = await Product.findByPk(productId, {
      include: [{
        model: Recipe,
        attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Initialize currentSteps from recipe if available
    let currentSteps = null;
    if (product.Recipe && product.Recipe.steps && product.Recipe.steps.steps) {
      currentSteps = product.Recipe.steps.steps.map(step => ({
        stepNumber: step.number,
        name: step.name,
        completed: false
      }));
    }

    const batchData = {
      productId,
      stage,
      currentSteps,
      ...(expectedYield && { expectedYield })
    };

    const newBatch = await Batch.create(batchData);
    
    // Fetch created batch with includes
    const createdBatch = await Batch.findByPk(newBatch.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name'],
        include: [{
          model: Recipe,
          attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
        }]
      }]
    });

    logger.log(`[CREATE BATCH] Created batch with ID: ${newBatch.id}, productId: ${productId}, stage: ${stage}`);
    res.status(201).json(createdBatch);
  } catch (err) {
    logger.error('[CREATE BATCH] Error:', err);
    res.status(500).json({ message: 'Error creating batch' });
  }
};

// PATCH /batches/:id - Flexible batch update endpoint
const updateBatch = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  logger.log(`[UPDATE BATCH] Attempting to update batch ${id} with data:`, updateData);
  
  try {
    const batch = await Batch.findByPk(id);
    if (!batch) {
      logger.log(`[UPDATE BATCH] Batch ${id} not found`);
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Store old values for logging
    const oldValues = {};
    Object.keys(updateData).forEach(key => {
      oldValues[key] = batch[key];
    });

    // Handle special stage transitions and auto-timestamps
    if (updateData.stage) {
      switch (updateData.stage) {
        case 'start-processing':
          if (!updateData.startedAt && !batch.startedAt) {
            updateData.startedAt = new Date();
            logger.log(`[UPDATE BATCH] Batch ${id} production started, startedAt set to: ${updateData.startedAt}`);
          }
          break;
        case 'end-processing':
          if (!updateData.processingCompletedAt) {
            updateData.processingCompletedAt = new Date();
            logger.log(`[UPDATE BATCH] Batch ${id} processing completed, processingCompletedAt set to: ${updateData.processingCompletedAt}`);
          }
          break;
        case 'packaging':
          if (!updateData.packagingStartedAt) {
            updateData.packagingStartedAt = new Date();
            logger.log(`[UPDATE BATCH] Batch ${id} packaging started, packagingStartedAt set to: ${updateData.packagingStartedAt}`);
          }
          break;
        case 'done':
          if (!updateData.finishedAt) {
            updateData.finishedAt = new Date();
            logger.log(`[UPDATE BATCH] Batch ${id} marked as completed, finishedAt set to: ${updateData.finishedAt}`);
          }
          break;
      }
    }

    // Update batch with provided data
    Object.assign(batch, updateData);

    await batch.save();
    
    // Log what was changed
    Object.keys(updateData).forEach(key => {
      if (oldValues[key] !== updateData[key]) {
        logger.log(`[UPDATE BATCH] Updated batch ${id} ${key} from '${oldValues[key]}' to '${updateData[key]}'`);
      }
    });

    // Return updated batch with includes
    const updatedBatch = await Batch.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['id', 'name'],
        include: [{
          model: Recipe,
          attributes: ['id', 'name', 'yield', 'totalTime', 'steps']
        }]
      }]
    });

    res.json(updatedBatch);
  } catch (err) {
    logger.error('[UPDATE BATCH] Error:', err);
    res.status(500).json({ message: 'Error updating batch' });
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
  updateBatch,
  deleteBatch
};