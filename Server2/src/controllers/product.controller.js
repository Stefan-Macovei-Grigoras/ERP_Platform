// 📁 src/controllers/product.controller.js
const { Product } = require('../models/index.model');

// GET /products
const getProducts = async (req, res) => {
  console.log('[GET PRODUCTS] Attempting to fetch all products...');
  try {
    const products = await Product.findAll();
    console.log(`[GET PRODUCTS] Fetched ${products.length} product(s).`);
    res.json(products);
  } catch (err) {
    console.error('[GET PRODUCTS] Error:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// POST /products
const createProduct = async (req, res) => {
  const { name, category, price, quantity } = req.body;
  console.log(`[CREATE PRODUCT] Received: name=${name}, category=${category}, price=${price}, quantity=${quantity}`);
  try {
    const newProduct = await Product.create({ name, category, price, quantity });
    console.log('[CREATE PRODUCT] Created:', newProduct.id);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('[CREATE PRODUCT] Error:', err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE PRODUCT] Trying to delete id=${id}`);
  try {
    const rowsDeleted = await Product.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      console.warn(`[DELETE PRODUCT] Not found: id=${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`[DELETE PRODUCT] Deleted id=${id}`);
    res.sendStatus(204);
  } catch (err) {
    console.error('[DELETE PRODUCT] Error:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct
};