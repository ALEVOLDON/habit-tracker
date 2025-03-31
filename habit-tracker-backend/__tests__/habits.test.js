const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');

describe('Habits API', () => {
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

  describe('GET /api/habits', () => {
    it('should return empty array when no habits exist', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return user habits', async () => {
      const habit = await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily'
      });

      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(1);
      expect(response.body.habits[0].title).toBe('Test Habit');
    });
  });

  describe('POST /api/habits', () => {
    it('should create a new habit', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Habit',
          frequency: 'daily'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Habit');
      expect(response.body.frequency).toBe('daily');
    });

    it('should validate habit data', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          frequency: 'invalid'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/habits/:id', () => {
    it('should update habit', async () => {
      const habit = await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily'
      });

      const response = await request(app)
        .patch(`/api/habits/${habit._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Habit'
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Habit');
    });
  });

  describe('DELETE /api/habits/:id', () => {
    it('should delete habit', async () => {
      const habit = await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily'
      });

      const response = await request(app)
        .delete(`/api/habits/${habit._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      const deletedHabit = await Habit.findById(habit._id);
      expect(deletedHabit).toBeNull();
    });
  });

  describe('POST /api/habits/:id/progress', () => {
    it('should add progress to habit', async () => {
      const habit = await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily'
      });

      const date = new Date().toISOString().split('T')[0];
      const response = await request(app)
        .post(`/api/habits/${habit._id}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send({ date });

      expect(response.status).toBe(200);
      expect(response.body.progress).toContain(date);
    });
  });

  describe('DELETE /api/habits/:id/progress/:date', () => {
    it('should remove progress from habit', async () => {
      const date = new Date().toISOString().split('T')[0];
      const habit = await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily',
        progress: [date]
      });

      const response = await request(app)
        .delete(`/api/habits/${habit._id}/progress/${date}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.progress).not.toContain(date);
    });
  });
}); 