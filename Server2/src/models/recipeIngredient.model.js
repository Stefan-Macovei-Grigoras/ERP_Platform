// models/recipeIngredient.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
  recipe_id: {type: DataTypes.INTEGER,allowNull: false},
  ingredientId: {type: DataTypes.INTEGER,allowNull: false},
  quantity_needed: {type: DataTypes.DECIMAL(10, 2),allowNull: false,
    validate: {
      min: 0.01
    }
  }
}, {
  timestamps: false,
  tableName: 'Recipe_Ingredient'
});

module.exports = RecipeIngredient;