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

app.post('/register', middleware.use('validator.register'), authController.register);

describe('POST /register', () => {
  it('should register successfully with valid data', async () => {
    const bodyRequest = {
      id: '1',
      full_name: 'Billie Eilish',
      email: 'billie@example.com',
      password: 'password123'
    };

    // Mocking UserModel - no existing email or ID
    User.prototype.findById = jest.fn().mockResolvedValue(null);
    User.prototype.findByEmail = jest.fn().mockResolvedValue(null);

    // Mocking bcrypt hash
    const hashedPassword = await bcrypt.hash(bodyRequest.password, 10);
    bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

    // Mocking UserModel - create new user
    User.prototype.create = jest.fn().mockResolvedValue({
      id: bodyRequest.id,
      full_name: bodyRequest.full_name,
      email: bodyRequest.email,
      password: hashedPassword
    });

    // Send request
    const response = await request(app)
      .post('/register')
      .send(bodyRequest);

    // Validate response
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registrasi berhasil');
  });

  it('should return 400 if email already exists', async () => {
    const bodyRequest = {
      id: '1',
      full_name: 'Billie Eilish',
      email: 'billie@example.com',
      password: 'password123'
    };

    // Mocking UserModel - existing email
    User.prototype.findByEmail = jest.fn().mockResolvedValue({
      id: bodyRequest.id,
      email: bodyRequest.email
    });

    // Send request
    const response = await request(app)
      .post('/register')
      .send(bodyRequest);

    // Validate response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('failed insert, email is existed');
  });

  it('should return 400 if ID already exists', async () => {
    const bodyRequest = {
      id: '1',
      full_name: 'Billie Eilish',
      email: 'billie@example.com',
      password: 'password123'
    };

    // Mocking UserModel - existing ID
    User.prototype.findById = jest.fn().mockResolvedValue({
      id: bodyRequest.id,
      email: bodyRequest.email
    });

    // Send request
    const response = await request(app)
      .post('/register')
      .send(bodyRequest);

    // Validate response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('failed insert, id is existed');
  });

  it('should return 500 on server error', async () => {
    const bodyRequest = {
      id: '1',
      full_name: 'Billie Eilish',
      email: 'billie@example.com',
      password: 'password123'
    };

    // Mocking UserModel - throwing error
    User.prototype.findById = jest.fn().mockRejectedValue(new Error('Server error'));

    // Send request
    const response = await request(app)
      .post('/register')
      .send(bodyRequest);

    // Validate response
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('internal server error');
  });
});
