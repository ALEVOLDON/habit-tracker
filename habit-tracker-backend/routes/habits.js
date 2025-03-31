const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Получить все привычки пользователя
router.get('/', auth, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.userId });
  res.json(habits);
});

// Добавить привычку
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

// Отметить выполнение
router.patch('/:id/check', auth, async (req, res) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });

  if (!habit) return res.status(404).json({ message: 'Привычка не найдена' });

  if (!habit.progress.includes(date)) habit.progress.push(date);
  await habit.save();

  res.json(habit);
});

// Удалить привычку
router.delete('/:id', auth, async (req, res) => {
  await Habit.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.json({ message: 'Удалено' });
});

module.exports = router;
