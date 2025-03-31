const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      
      // Проверяем, что пользователь создан в базе
      const user = await User.findOne({ email: 'newuser@example.com' });
      expect(user).toBeTruthy();
      expect(user.email).toBe('newuser@example.com');
    });

    it('should not register user with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('valid email');
    });

    it('should not register user with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('6 characters');
    });

    it('should not register existing user', async () => {
      // Создаем пользователя
      await User.create({
        email: 'existing@example.com',
        passwordHash: await bcrypt.hash('password123', 10)
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя
      await User.create({
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10)
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Incorrect password');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not found');
    });

    it('should validate input data', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('valid email');
    });
  });

  describe('Authentication Middleware', () => {
    let token;

    beforeEach(async () => {
      const user = await User.create({
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10)
      });
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    });

    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/habits');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should deny access with expired token', async () => {
      // Создаем токен с истекшим сроком действия
      const expiredToken = jwt.sign(
        { userId: 'test' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token expired');
    });
  });
}); 