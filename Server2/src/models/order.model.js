// 📁 src/models/order.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    stage: {
      type: DataTypes.ENUM('due', 'processing', 'packaging', 'done'),
      allowNull: false,
      defaultValue: 'due'
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    finishedAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });

module.exports = Order;
