const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateHabit = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('frequency')
    .isIn(['daily', 'weekly'])
    .withMessage('Frequency must be either daily or weekly')
];

// Get all user habits
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId });
    res.json(habits);
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new habit
router.post('/', auth, validateHabit, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, frequency } = req.body;
    const habit = new Habit({
      userId: req.user.userId,
      title,
      frequency,
      progress: []
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark habit as completed
router.patch('/:id/check', auth, async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (!habit.progress.includes(date)) {
      habit.progress.push(date);
      await habit.save();
    }

    res.json(habit);
  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Habit.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
