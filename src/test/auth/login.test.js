const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { authController } = require('../../controller');
const middleware = require('../../middleware');
const User = require('../../model/UserModel');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json());

// Mock validator middleware
middleware.use = jest.fn(() => (req, res, next) => next());

app.post('/login', middleware.use('validator.login'), authController.login);

describe('POST /login', () => {
  it('should login successfully with valid credentials', async () => {
    const email = 'billie@example.com';
    const password = 'password123';

    // Mocking UserModel - valid credentials
    const hashedPassword = await bcrypt.hash(password, 10);
    User.prototype.findByEmail = jest.fn().mockResolvedValue({
      id: 1,
      email: email,
      password: hashedPassword,
      full_name: 'Billie'
    });

    const response = await request(app)
      .post('/login')
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('login successful');
    expect(response.body.data).toHaveProperty('token');
  });

  it('should return 400 with invalid email', async () => {
    const email = 'billie@example.com';
    const password = 'password123';

    // Mocking UserModel - invalid email
    User.prototype.findByEmail = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({ email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email not found');
  });

  it('should return 400 with wrong password', async () => {
    const email = 'billie@example.com';
    const password = 'wrongpassword';

    // Mocking UserModel - valid email, wrong password
    const hashedPassword = await bcrypt.hash('password123', 10);
    User.prototype.findByEmail = jest.fn().mockResolvedValue({
      id: 1,
      email: email,
      password: hashedPassword,
      full_name: 'Billie'
    });

    const response = await request(app)
      .post('/login')
      .send({ email, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid password');
  });

  it('should return 500 on server error', async () => {
    // Mocking UserModel - server error
    User.prototype.findByEmail = jest.fn().mockRejectedValue(new Error('Server error'));

    const response = await request(app)
      .post('/login')
      .send({ email: 'billie@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('internal server error');
  });
});
