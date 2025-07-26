// 📁 src/models/product.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false }
}, {
  createdAt: false,  // Disable createdAt
  updatedAt: true    // Keep updatedAt only
});

module.exports = Product;