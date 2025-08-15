// 📁 src/controllers/product.controller.js
const { UPDATE } = require('sequelize/lib/query-types');
const { Product } = require('../models/index.model');
const logger = require('../utils/logger');

// GET /products
const getProducts = async (req, res) => {
  logger.log('[GET PRODUCTS] Attempting to fetch all products...');
  try {
    const products = await Product.findAll();
    logger.log(`[GET PRODUCTS] Fetched ${products.length} product(s).`);
    res.json(products);
  } catch (err) {
    logger.error('[GET PRODUCTS] Error:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// POST /products
const createProduct = async (req, res) => {
  const { name, category, price, quantity } = req.body;
  logger.log(`[CREATE PRODUCT] Received: name=${name}, category=${category}, price=${price}, quantity=${quantity}`);
  try {
    const newProduct = await Product.create({ name, category, price, quantity });
    logger.log('[CREATE PRODUCT] Created:', newProduct.id);
    res.status(201).json(newProduct);
  } catch (err) {
    logger.error('[CREATE PRODUCT] Error:', err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  logger.log(`[DELETE PRODUCT] Trying to delete id=${id}`);
  try {
    const rowsDeleted = await Product.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      logger.warn(`[DELETE PRODUCT] Not found: id=${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.log(`[DELETE PRODUCT] Deleted id=${id}`);
    res.sendStatus(204);
  } catch (err) {
    logger.error('[DELETE PRODUCT] Error:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity } = req.body;
  logger.log(`[UPDATE PRODUCT] Trying to update id=${id} with:`, { name, category, price, quantity });

  try {
    // Check if product exists
    const product = await Product.findByPk(id);
    if (!product) {
      logger.warn(`[UPDATE PRODUCT] Not found: id=${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product (only fields that are provided)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;

    const [rowsUpdated] = await Product.update(updateData, {
      where: { id }
    });

    if (rowsUpdated === 0) {
      logger.warn(`[UPDATE PRODUCT] No changes made for id=${id}`);
      return res.status(400).json({ message: 'No changes made' });
    }

    // Fetch the updated product to return it
    const updatedProduct = await Product.findByPk(id);
    logger.log(`[UPDATE PRODUCT] Successfully updated id=${id}`);
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (err) {
    logger.error('[UPDATE PRODUCT] Error:', err);
    res.status(500).json({ message: 'Error updating product' });
  }
  logger.log('___________________________')
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
};