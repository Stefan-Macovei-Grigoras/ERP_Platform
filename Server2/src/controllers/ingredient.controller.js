// 📁 src/controllers/rawIngredient.controller.js
const { Ingredient } = require('../models/index.model');
const logger = require('../utils/logger');

// GET /ingredient
const getIngredient = async (req, res) => {
  logger.log('[GET INGREDIENTS] Attempting to fetch all ingredients...');
  try {
    const ingredients = await Ingredient.findAll();
    logger.log(`[GET INGREDIENTS] Fetched ${ingredients.length} ingredient(s).`);
    res.json(ingredients);
  } catch (err) {
    logger.error('[GET INGREDIENTS] Error:', err);
    res.status(500).json({ message: 'Error fetching ingredients' });
  }
};

// POST /ingredient
const createIngredient = async (req, res) => {
  const { name, quantity, minThreshold, unit } = req.body;
  logger.log(`[CREATE INGREDIENT] Received: name=${name}, quantity=${quantity}, minThreshold=${minThreshold}, unit=${unit}`);
  try {
    const newIngredient = await Ingredient.create({ name, quantity, minThreshold, unit });
    logger.log('[CREATE INGREDIENT] Created:', newIngredient.id);
    res.status(201).json(newIngredient);
  } catch (err) {
    logger.error('[CREATE INGREDIENT] Error:', err);
    res.status(500).json({ message: 'Error creating inngredient' });
  }
};

// DELETE /ingredient/:id
const deleteIngredient = async (req, res) => {
  const { id } = req.params;
  logger.log(`[DELETE INGREDIENT] Trying to delete id=${id}`);
  try {
    const rowsDeleted = await Ingredient.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      logger.warn(`[DELETE INGREDIENT] Not found: id=${id}`);
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    logger.log(`[DELETE INGREDIENT] Deleted id=${id}`);
    res.sendStatus(204);
  } catch (err) {
    logger.error('[DELETE INGREDIENT] Error:', err);
    res.status(500).json({ message: 'Error deleting raw Ingredient' });
  }
};

const updateIngredient = async(req, res) =>{
  const {id} = req.params;
  logger.log(`[UPDATE INGREDIENT] Trying to UPDATE id=${id}`);
  try{
    const ingredient = await Ingredient.findByPk(id);
    if(!ingredient) return res.status(404).json({message: 'Ingredient not found'});

    const {name, quantity, minThreshold} = req.body;
    if(name) ingredient.name = name;
    if(quantity) ingredient.quantity = quantity;
    if(minThreshold) ingredient.minThreshold = minThreshold;

    await ingredient.save();
    logger.log(`[UPDATE INGREDIENT] Updated id=${id}`);
    res.json(ingredient);
  }catch{
    logger.error('[UPDATE INGREDIENT] Error:', err);
    res.status(500).json({ message: 'Error updating ingredient' });
  }

}

module.exports = {
  getIngredient,  
  createIngredient,
  deleteIngredient,
  updateIngredient
};
