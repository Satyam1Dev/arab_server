const express = require('express');
const router = express.Router();
const Product = require('../modal/Product');

// Create product route
router.post('/', async (req, res) => {
  try {
    const { name, image, slug } = req.body;
    const newProduct = new Product({ name, image, slug });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
});



// Update product route (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name,image, slug} = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { name,  image, slug}, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Get product route
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Delete product route
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
