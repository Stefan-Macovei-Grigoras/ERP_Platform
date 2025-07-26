// 📁 src/models/product.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Material = sequelize.define('Material', {
  name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  minThreshold: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: false  // 👈 ADD THIS LINE!
  });


module.exports = Material;