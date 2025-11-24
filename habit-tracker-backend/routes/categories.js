const express = require('express');
const Category = require('../models/Category');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code')
];

// Get all categories
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
    // Проверяем уникальность имени для пользователя
    const existingCategory = await Category.findOne({
      userId: req.user.userId,
      name: req.body.name
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = new Category({
      userId: req.user.userId,
      name: req.body.name,
      color: req.body.color || '#4CAF50' // Используем зеленый цвет по умолчанию
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
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
    // Проверяем уникальность имени для пользователя
    if (req.body.name) {
      const existingCategory = await Category.findOne({
        userId: req.user.userId,
        name: req.body.name,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Удаляем ссылки на категорию из всех привычек
    await Habit.updateMany(
      { categoryId: req.params.id },
      { $set: { categoryId: null } }
    );

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
