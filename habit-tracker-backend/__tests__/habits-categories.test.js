const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Habit = require('../models/Habit');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

describe('Habits and Categories Integration', () => {
  let token;
  let userId;
  let categoryId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Habit.deleteMany({});

    // Создаем тестового пользователя
    const user = await User.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword'
    });
    userId = user._id;
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Создаем тестовую категорию
    const category = await Category.create({
      userId,
      name: 'Test Category',
      color: '#FF0000'
    });
    categoryId = category._id.toString();
  });

  describe('Creating habits with categories', () => {
    it('should create habit with category', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Habit with Category',
          frequency: 'daily',
          categoryId
        });

      expect(response.status).toBe(201);
      expect(response.body.categoryId).toBe(categoryId);
    });

    it('should create habit without category', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Habit without Category',
          frequency: 'daily'
        });

      expect(response.status).toBe(201);
      expect(response.body.categoryId).toBeNull();
    });

    it('should not create habit with non-existent category', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Habit with Invalid Category',
          frequency: 'daily',
          categoryId: new mongoose.Types.ObjectId().toString()
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category not found');
    });
  });

  describe('Filtering habits by category', () => {
    beforeEach(async () => {
      // Создаем несколько привычек с категориями
      await Habit.create([
        { userId, title: 'Habit 1', frequency: 'daily', categoryId },
        { userId, title: 'Habit 2', frequency: 'daily', categoryId: null },
        { userId, title: 'Habit 3', frequency: 'daily', categoryId }
      ]);
    });

    it('should return habits filtered by category', async () => {
      const response = await request(app)
        .get(`/api/habits?categoryId=${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(2);
      expect(response.body.habits.every(h => h.categoryId._id === categoryId)).toBe(true);
    });

    it('should return habits without category', async () => {
      const response = await request(app)
        .get('/api/habits?categoryId=null')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(1);
      expect(response.body.habits[0].categoryId).toBeNull();
    });
  });

  describe('Updating habit category', () => {
    let habitId;

    beforeEach(async () => {
      const habit = await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily'
      });
      habitId = habit._id;
    });

    it('should update habit category', async () => {
      const response = await request(app)
        .patch(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          categoryId
        });

      expect(response.status).toBe(200);
      expect(response.body.categoryId).toBe(categoryId);
    });

    it('should remove category from habit', async () => {
      // Сначала добавляем категорию
      await Habit.findByIdAndUpdate(habitId, { categoryId });

      const response = await request(app)
        .patch(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          categoryId: null
        });

      expect(response.status).toBe(200);
      expect(response.body.categoryId).toBeNull();
    });
  });

  describe('Deleting category with habits', () => {
    beforeEach(async () => {
      // Создаем привычку с категорией
      await Habit.create({
        userId,
        title: 'Test Habit',
        frequency: 'daily',
        categoryId
      });
    });

    it('should delete category and remove categoryId from habits', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Проверяем, что категория удалена
      const deletedCategory = await Category.findById(categoryId);
      expect(deletedCategory).toBeNull();

      // Проверяем, что у привычки удалена ссылка на категорию
      const habit = await Habit.findOne({ userId });
      expect(habit.categoryId).toBeNull();
    });
  });

  describe('Category statistics in habits', () => {
    beforeEach(async () => {
      // Создаем несколько привычек с категориями
      await Habit.create([
        { userId, title: 'Habit 1', frequency: 'daily', categoryId },
        { userId, title: 'Habit 2', frequency: 'daily', categoryId },
        { userId, title: 'Habit 3', frequency: 'daily', categoryId: null }
      ]);
    });

    it('should include category information in habits list', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(3);
      
      const habitsWithCategory = response.body.habits.filter(h => h.categoryId);
      expect(habitsWithCategory.length).toBe(2);
      expect(habitsWithCategory[0].categoryId._id).toBe(categoryId);
      expect(habitsWithCategory[0].categoryId.name).toBe('Test Category');
      expect(habitsWithCategory[0].categoryId.color).toBe('#FF0000');
    });

    it('should include category information in stats', async () => {
      const response = await request(app)
        .get('/api/habits/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(3);
      
      const habitsWithCategory = response.body.habits.filter(h => h.categoryId);
      expect(habitsWithCategory.length).toBe(2);
      expect(habitsWithCategory[0].categoryId._id).toBe(categoryId);
      expect(habitsWithCategory[0].categoryId.name).toBe('Test Category');
      expect(habitsWithCategory[0].categoryId.color).toBe('#FF0000');
    });
  });
}); 