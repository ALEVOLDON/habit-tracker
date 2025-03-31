const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');
const Habit = require('../models/Habit');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Category Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Habit.deleteMany({});

    // Создаем тестового пользователя
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    token = response.body.token;
    userId = response.body.userId;
  });

  describe('GET /api/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return user categories', async () => {
      const category = await Category.create({
        userId,
        name: 'Health',
        color: '#FF0000'
      });

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Health');
      expect(response.body[0].color).toBe('#FF0000');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Health',
          color: '#FF0000'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Health');
      expect(response.body.color).toBe('#FF0000');
      expect(response.body.userId).toBe(userId);
    });

    it('should use default color if not provided', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Health'
        });

      expect(response.status).toBe(201);
      expect(response.body.color).toBe('#4CAF50');
    });

    it('should not allow duplicate category names for the same user', async () => {
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Health',
          color: '#FF0000'
        });

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Health',
          color: '#00FF00'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category with this name already exists');
    });

    it('should validate category name length', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          color: '#FF0000'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name must be between 1 and 50 characters');
    });

    it('should validate color format', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Health',
          color: 'invalid-color'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Color must be a valid hex color code');
    });
  });

  describe('PATCH /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create({
        userId,
        name: 'Health',
        color: '#FF0000'
      });
      categoryId = category._id.toString();
    });

    it('should update category name and color', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Fitness',
          color: '#00FF00'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Fitness');
      expect(response.body.color).toBe('#00FF00');
    });

    it('should allow partial updates', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Fitness'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Fitness');
      expect(response.body.color).toBe('#FF0000');
    });

    it('should not allow duplicate category names', async () => {
      await Category.create({
        userId,
        name: 'Fitness',
        color: '#00FF00'
      });

      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Fitness'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category with this name already exists');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create({
        userId,
        name: 'Health',
        color: '#FF0000'
      });
      categoryId = category._id.toString();
    });

    it('should delete category and update associated habits', async () => {
      // Создаем привычку с этой категорией
      const habit = await Habit.create({
        userId,
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        categoryId
      });

      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Category deleted successfully');

      // Проверяем, что категория удалена
      const category = await Category.findById(categoryId);
      expect(category).toBeNull();

      // Проверяем, что привычка обновлена
      const updatedHabit = await Habit.findById(habit._id);
      expect(updatedHabit.categoryId).toBeNull();
    });

    it('should return 404 for non-existent category', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/categories/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });
  });
}); 