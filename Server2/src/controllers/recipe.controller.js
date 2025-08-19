// 📁 src/controllers/recipe.controller.js
const { Recipe, Product } = require('../models/index.model');
const logger = require('../utils/logger');

// GET /recipes
const getRecipes = async (req, res) => {
  logger.log('[GET RECIPES] Attempting to fetch all recipes...');
  try {
    const recipes = await Recipe.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'name']
      }]
    });
    logger.log(`[GET RECIPES] Fetched ${recipes.length} recipe(s).`);
    res.json(recipes);
  } catch (err) {
    logger.error('[GET RECIPES] Error:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};

// GET /recipes/:id
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  logger.log(`[GET RECIPE] Attempting to fetch recipe id=${id}...`);
  try {
    const recipe = await Recipe.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['id', 'name']
      }]
    });

    if (!recipe) {
      logger.warn(`[GET RECIPE] Not found: id=${id}`);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    logger.log(`[GET RECIPE] Found recipe: ${recipe.name}`);
    res.json(recipe);
  } catch (err) {
    logger.error('[GET RECIPE] Error:', err);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
};

// GET /recipe/product/:productId
const getRecipesByProduct = async (req, res) => {
  const { productId } = req.params;
  logger.log(`[GET RECIPES BY PRODUCT] Attempting to fetch recipes for productId=${productId}...`);
  try {
    const recipes = await Recipe.findAll({
      where: { productId },
      include: [{
        model: Product,
        attributes: ['id', 'name']
      }]
    });
    //console.log(JSON.stringify(recipes)); 
    logger.log(`[GET RECIPES BY PRODUCT] Fetched ${recipes.length} recipe(s) for productId=${productId}.`);
    res.json(recipes);
  } catch (err) {
    logger.error('[GET RECIPES BY PRODUCT] Error:', err);
    res.status(500).json({ message: 'Error fetching recipes for product' });
  }
};

// POST /recipes
const createRecipe = async (req, res) => {
  const { productId, name, yield: recipeYield, totalTime, steps } = req.body;
  logger.log(`[CREATE RECIPE] Received: productId=${productId}, name=${name}, yield=${recipeYield}, totalTime=${totalTime}mins`);
  
  try {
    // Validate that the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      logger.warn(`[CREATE RECIPE] Product not found: productId=${productId}`);
      return res.status(400).json({ message: 'Product not found' });
    }

    // Validate steps format (should be array)
    if (!Array.isArray(steps) || steps.length === 0) {
      logger.warn('[CREATE RECIPE] Invalid steps format - must be non-empty array');
      return res.status(400).json({ message: 'Steps must be a non-empty array' });
    }

    // Validate each step has required fields
    const isValidSteps = steps.every(step => 
      step.stepNumber && 
      step.instruction && 
      typeof step.stepNumber === 'number' &&
      typeof step.instruction === 'string'
    );

    if (!isValidSteps) {
      logger.warn('[CREATE RECIPE] Invalid step format - each step must have stepNumber and instruction');
      return res.status(400).json({ 
        message: 'Each step must have stepNumber (number) and instruction (string)' 
      });
    }

    const newRecipe = await Recipe.create({ 
      productId, 
      name, 
      yield: recipeYield, 
      totalTime, 
      steps: JSON.stringify(steps)
    });

    logger.log('[CREATE RECIPE] Created:', newRecipe.id);
    
    // Fetch the created recipe with product details
    const createdRecipe = await Recipe.findByPk(newRecipe.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json(createdRecipe);
  } catch (err) {
    logger.error('[CREATE RECIPE] Error:', err);
    res.status(500).json({ message: 'Error creating recipe' });
  }
};

// PUT /recipes/:id
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  const { productId, name, yield: recipeYield, totalTime, steps } = req.body;
  logger.log(`[UPDATE RECIPE] Trying to update id=${id} with:`, { 
    productId, name, yield: recipeYield, totalTime, stepsCount: steps?.length 
  });

  try {
    // Check if recipe exists
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      logger.warn(`[UPDATE RECIPE] Not found: id=${id}`);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Build update data object (only fields that are provided)
    const updateData = {};
    
    if (productId !== undefined) {
      // Validate that the new product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        logger.warn(`[UPDATE RECIPE] Product not found: productId=${productId}`);
        return res.status(400).json({ message: 'Product not found' });
      }
      updateData.productId = productId;
    }
    
    if (name !== undefined) updateData.name = name;
    if (recipeYield !== undefined) updateData.yield = recipeYield;
    if (totalTime !== undefined) updateData.totalTime = totalTime;
    
    if (steps !== undefined) {
      // Validate steps format
      if (!Array.isArray(steps) || steps.length === 0) {
        logger.warn('[UPDATE RECIPE] Invalid steps format - must be non-empty array');
        return res.status(400).json({ message: 'Steps must be a non-empty array' });
      }

      // Validate each step
    const isValidSteps = steps.every(step => 
      step.number && 
      step.instructions && 
      typeof step.number === 'number' &&
      typeof step.instructions === 'string'
    );

      if (!isValidSteps) {
        logger.warn('[UPDATE RECIPE] Invalid step format');
        return res.status(400).json({ 
        message: 'Each step must have number (number) and instructions (string)' 
      });
      }

      //updateData.steps = JSON.stringify(steps);
      updateData.steps ={ steps };
    }

    // Perform the update
    const [rowsUpdated] = await Recipe.update(updateData, {
      where: { id }
    });

    if (rowsUpdated === 0) {
      logger.warn(`[UPDATE RECIPE] No changes made for id=${id}`);
      return res.status(400).json({ message: 'No changes made' });
    }

    // Fetch the updated recipe to return it
    const updatedRecipe = await Recipe.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['id', 'name']
      }]
    });

    logger.log(`[UPDATE RECIPE] Successfully updated id=${id}`);
    
    res.json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });

  } catch (err) {
    logger.error('[UPDATE RECIPE] Error:', err);
    res.status(500).json({ message: 'Error updating recipe' });
  }
  logger.log('___________________________');
};

// DELETE /recipes/:id
const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  logger.log(`[DELETE RECIPE] Trying to delete id=${id}`);
  
  try {
    const rowsDeleted = await Recipe.destroy({ where: { id } });
    
    if (rowsDeleted === 0) {
      logger.warn(`[DELETE RECIPE] Not found: id=${id}`);
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    logger.log(`[DELETE RECIPE] Deleted id=${id}`);
    res.status(204).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    logger.error('[DELETE RECIPE] Error:', err);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
};



module.exports = {
  getRecipes,
  getRecipeById,
  getRecipesByProduct,
  createRecipe,
  updateRecipe,
  deleteRecipe
};