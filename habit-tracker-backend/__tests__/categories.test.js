const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

describe('Categories API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Создаем тестового пользователя
    const user = await User.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword'
    });
    userId = user._id;
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
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
      // Создаем несколько категорий
      await Category.create([
        { userId, name: 'Category 1', color: '#FF0000' },
        { userId, name: 'Category 2', color: '#00FF00' }
      ]);

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Category 1');
      expect(response.body[1].name).toBe('Category 2');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Category',
          color: '#FF0000'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Category');
      expect(response.body.color).toBe('#FF0000');
      expect(response.body.userId.toString()).toBe(userId.toString());
    });

    it('should use default color if not provided', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Default Color Category'
        });

      expect(response.status).toBe(201);
      expect(response.body.color).toBe('#4CAF50');
    });

    it('should validate category name', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '', // Пустое имя
          color: '#FF0000'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('between 1 and 50 characters');
    });

    it('should validate category color format', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Invalid Color',
          color: 'red' // Неверный формат цвета
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('valid hex color code');
    });

    it('should not create category with duplicate name', async () => {
      // Создаем первую категорию
      await Category.create({
        userId,
        name: 'Duplicate Category',
        color: '#FF0000'
      });

      // Пытаемся создать категорию с тем же именем
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Duplicate Category',
          color: '#00FF00'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category with this name already exists');
    });
  });

  describe('PATCH /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create({
        userId,
        name: 'Original Category',
        color: '#FF0000'
      });
      categoryId = category._id;
    });

    it('should update category name and color', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Category',
          color: '#00FF00'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Category');
      expect(response.body.color).toBe('#00FF00');
    });

    it('should not update non-existent category', async () => {
      const response = await request(app)
        .patch(`/api/categories/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Category',
          color: '#00FF00'
        });

      expect(response.status).toBe(404);
    });

    it('should not update category with duplicate name', async () => {
      // Создаем вторую категорию
      await Category.create({
        userId,
        name: 'Another Category',
        color: '#0000FF'
      });

      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Another Category',
          color: '#00FF00'
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
        name: 'Category to Delete',
        color: '#FF0000'
      });
      categoryId = category._id;
    });

    it('should delete existing category', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const deletedCategory = await Category.findById(categoryId);
      expect(deletedCategory).toBeNull();
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .delete(`/api/categories/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
}); 