// models/recipe.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  id: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
  productId: {type: DataTypes.INTEGER,allowNull: false},
  name: {type: DataTypes.STRING(100),allowNull: false},
  yield: {type: DataTypes.INTEGER,allowNull: false},
  totalTime: {type: DataTypes.INTEGER,allowNull: false},
  steps: {type: DataTypes.JSON,allowNull: false}
}, {
  timestamps: false,
  tableName: 'Recipe',
  freezeTableName: true,
  underscored: false
});

module.exports = Recipe;