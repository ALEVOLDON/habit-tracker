const express = require('express');
const mongoose = require('mongoose');
const Habit = require('../models/Habit');
const Category = require('../models/Category');
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
    .withMessage('Frequency must be either daily or weekly'),
  body('categoryId')
    .optional({ nullable: true })
    .custom(async (value, { req }) => {
      if (!value) return true;
      const category = await Category.findOne({ _id: value, userId: req.user.userId });
      if (!category) {
        throw new Error('Category not found');
      }
      return true;
    })
];

// Get all user habits with filtering and sorting
router.get('/', auth, async (req, res) => {
  try {
    const {
      categoryId,
      frequency,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Создаем базовый запрос
    const query = { userId: req.user.userId };

    // Добавляем фильтры
    if (categoryId === 'null') {
      query.categoryId = null;
    } else if (categoryId) {
      query.categoryId = categoryId;
    }
    if (frequency) {
      query.frequency = frequency;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Определяем сортировку
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Выполняем запрос с пагинацией
    const skip = (page - 1) * limit;
    const habits = await Habit.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('categoryId', 'name color');

    // Получаем общее количество для пагинации
    const total = await Habit.countDocuments(query);

    // Получаем статистику для каждой привычки
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const habitsWithStats = habits.map(habit => {
      const stats = habit.getStats(thirtyDaysAgo, today);
      return {
        ...habit.toObject(),
        stats
      };
    });

    res.json({
      habits: habitsWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get habits statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const habits = await Habit.find({ userId: req.user.userId })
      .populate('categoryId', 'name color');

    if (habits.length === 0) {
      return res.json({
        habits: [],
        total: {
          totalHabits: 0,
          averageCompletion: 0,
          bestStreak: 0,
          totalCompleted: 0,
          totalPossible: 0
        },
        period: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        }
      });
    }

    const habitsWithStats = habits.map(habit => {
      const stats = habit.getStats(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
      return {
        _id: habit._id,
        title: habit.title,
        frequency: habit.frequency,
        categoryId: habit.categoryId,
        stats
      };
    });

    // Считаем общую статистику
    const totalStats = {
      totalHabits: habits.length,
      averageCompletion: Math.round(
        habitsWithStats.reduce((sum, h) => sum + h.stats.percentage, 0) / habits.length
      ),
      bestStreak: Math.max(0, ...habitsWithStats.map(h => h.stats.streak)),
      totalCompleted: habitsWithStats.reduce((sum, h) => sum + h.stats.completed, 0),
      totalPossible: habitsWithStats.reduce((sum, h) => sum + h.stats.total, 0)
    };

    res.json({
      habits: habitsWithStats,
      total: totalStats,
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new habit
router.post('/', auth, validateHabit, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, frequency, categoryId } = req.body;
    const habit = new Habit({
      userId: req.user.userId,
      title,
      frequency,
      categoryId: categoryId || null,
      progress: []
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update habit
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.frequency) updates.frequency = req.body.frequency;
    if ('categoryId' in req.body) updates.categoryId = req.body.categoryId || null;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updates,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (err) {
    console.error('Error updating habit:', err);
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

// Добавить прогресс к привычке
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    if (!habit.progress.includes(date)) {
      habit.progress.push(date);
      await habit.save();
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить прогресс из привычки
router.delete('/:id/progress/:date', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const dateIndex = habit.progress.indexOf(req.params.date);
    if (dateIndex > -1) {
      habit.progress.splice(dateIndex, 1);
      await habit.save();
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
