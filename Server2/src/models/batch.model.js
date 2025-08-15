// 📁 src/models/batch.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Batch = sequelize.define('Batch', {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    stage: {
      type: DataTypes.ENUM('due', 'processing', 'packaging', 'done'),
      allowNull: false,
      defaultValue: 'due'
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    finishedAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }
, {
    timestamps: true,  // Enable timestamps
    tableName: 'Batch'
  });

module.exports = Batch;
