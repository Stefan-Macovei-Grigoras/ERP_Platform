// 📁 src/models/material.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ingredient = sequelize.define('Ingredient', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  minThreshold: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: false,
    tableName: 'Ingredient'
  });


module.exports = Ingredient;