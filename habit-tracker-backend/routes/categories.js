const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code')
];

// Get all user categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.userId });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new category
router.post('/', auth, validateCategory, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, color } = req.body;
    const category = new Category({
      userId: req.user.userId,
      name,
      color: color || '#4CAF50'
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
router.patch('/:id', auth, validateCategory, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, color } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, color },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Category.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 