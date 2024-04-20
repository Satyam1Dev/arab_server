// routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../modal/Category');
const slugify = require('slugify');


// Create a category
router.post('/', async (req, res) => {
  try {
    const { name, image } = req.body;
    const slug = slugify(name, { lower: true }); // Generate slug from name
    const newCategory = new Category({ name, image, slug });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    res.status(500).json({ error: 'Error creating category' });
  }
});

// Read all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Read a single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Error fetching category' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, image,slug } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, image,slug }, { new: true });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Error updating category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Error deleting category' });
  }
});

module.exports = router;
