// 📁 src/models/user.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('admin', 'factory_worker', 'packaging_worker'),
    allowNull: false
  }
}, {
    timestamps: false,  // 👈 ADD THIS LINE!
    tableName: 'User'
  }); 

module.exports = User;
