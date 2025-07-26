const { sequelize } = require('../config/database');

const User = require('./user.model'); 
const Product = require('./product.model');
const Material = require('./material.model');;
const Order = require('./order.model');

// Associations
Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { sequelize, User, Product, Material, Order };