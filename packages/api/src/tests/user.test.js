// src/tests/user.test.js
import request from 'supertest';
import app from '../../app.js';

describe('User Authentication Routes', () => {
  // Test for user registration
  it('should register a user successfully', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Lukas',
        email: 'lukas@example.com',
        password: 'Password123',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');
  });

  // Test for user login
  it('should login a user successfully', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'lukas@example.com',
        password: 'Password123',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');
  });

  // Test for retrieving user profile (authenticated)
  it('should get the user profile successfully when authenticated', async () => {
    // First, login to get a valid token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'lukas@example.com',
        password: 'Password123',
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
  });

  // Test for updating user profile (authenticated)
  it('should update the user profile successfully when authenticated', async () => {
    // First, login to get a valid token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'lukas@example.com',
        password: 'Password123',
      });

    const token = loginResponse.body.token;

    const updatedName = 'Lukas Updated';
    const updatedEmail = 'lukas.updated@example.com';

    const response = await request(app)
      .put('/api/users/profile')
      .send({
        name: updatedName,
        email: updatedEmail,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedName);
    expect(response.body.email).toBe(updatedEmail);
  });
});