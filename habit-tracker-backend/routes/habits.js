const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all user habits
router.get('/', auth, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.userId });
  res.json(habits);
});

// Add new habit
router.post('/', auth, async (req, res) => {
  const { title, frequency } = req.body;
  const habit = new Habit({
    userId: req.user.userId,
    title,
    frequency,
    progress: []
  });

  await habit.save();
  res.status(201).json(habit);
});

// Mark habit as completed
router.patch('/:id/check', auth, async (req, res) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });

  if (!habit) return res.status(404).json({ message: 'Habit not found' });

  if (!habit.progress.includes(date)) habit.progress.push(date);
  await habit.save();

  res.json(habit);
});

// Delete habit
router.delete('/:id', auth, async (req, res) => {
  await Habit.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;
