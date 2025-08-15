const { sequelize } = require('../config/database');

const User = require('./user.model'); 
const Product = require('./product.model');
const Ingredient = require('./ingredient.model');
const Batch = require('./batch.model');
const RecipeIngredient = require('./recipeIngredient.model');
const Recipe = require('./recipe.model');

Product.hasOne(Recipe, { foreignKey: 'productId', onDelete: 'CASCADE' });
Recipe.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Batch, { foreignKey: 'productId', onDelete: 'RESTRICT' });
Batch.belongsTo(Product, { foreignKey: 'productId' });

Recipe.hasMany(RecipeIngredient, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipeId' });

Ingredient.hasMany(RecipeIngredient, { foreignKey: 'ingredientId', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
RecipeIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' });

module.exports = {
  Product,
  Recipe,
  Ingredient,
  RecipeIngredient,
  Batch,
  User
};