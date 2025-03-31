const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');

describe('Habits Statistics API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = new User({
      email: 'test@example.com',
      passwordHash: 'hashedPassword'
    });
    await user.save();
    userId = user._id;
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  describe('GET /api/habits/stats', () => {
    it('should return empty stats when no habits exist', async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await request(app)
        .get(`/api/habits/stats?startDate=${yesterday}&endDate=${today}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits).toEqual([]);
      expect(response.body.total.totalHabits).toBe(0);
      expect(response.body.total.averageCompletion).toBe(0);
      expect(response.body.total.bestStreak).toBe(0);
    });

    it('should calculate correct statistics for daily habits', async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Создаем привычку с прогрессом
      const habit = await Habit.create({
        userId,
        title: 'Daily Habit',
        frequency: 'daily',
        progress: [today, yesterday]
      });

      const response = await request(app)
        .get(`/api/habits/stats?startDate=${yesterday}&endDate=${today}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(1);
      expect(response.body.habits[0].stats.percentage).toBe(100);
      expect(response.body.habits[0].stats.streak).toBe(2);
    });

    it('should calculate correct statistics for weekly habits', async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Создаем привычку с прогрессом
      const habit = await Habit.create({
        userId,
        title: 'Weekly Habit',
        frequency: 'weekly',
        progress: [today, lastWeek]
      });

      const response = await request(app)
        .get(`/api/habits/stats?startDate=${lastWeek}&endDate=${today}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(1);
      expect(response.body.habits[0].stats.percentage).toBe(100);
      expect(response.body.habits[0].stats.streak).toBe(2);
    });

    it('should calculate correct total statistics', async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Создаем несколько привычек
      await Habit.create([
        {
          userId,
          title: 'Habit 1',
          frequency: 'daily',
          progress: [today, yesterday]
        },
        {
          userId,
          title: 'Habit 2',
          frequency: 'daily',
          progress: [today]
        }
      ]);

      const response = await request(app)
        .get(`/api/habits/stats?startDate=${yesterday}&endDate=${today}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.total.totalHabits).toBe(2);
      expect(response.body.total.averageCompletion).toBe(75); // (100% + 50%) / 2
      expect(response.body.total.bestStreak).toBe(2);
      expect(response.body.total.totalCompleted).toBe(3);
      expect(response.body.total.totalPossible).toBe(4);
    });

    it('should respect custom date range', async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily',
        progress: [today, lastMonth]
      });

      const response = await request(app)
        .get(`/api/habits/stats?startDate=${lastMonth}&endDate=${today}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.period.start).toBe(lastMonth);
      expect(response.body.period.end).toBe(today);
    });
  });
}); 