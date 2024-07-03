import supertest from 'supertest';
import { User } from '../../models/user.model';
import app from '../..';

const request = supertest(app);

const userTest: Omit<User, 'id'> = {
  username: `uda-tsu-${Date.now()}`,
  fullName: 'Dinh Napster Tu',
  phoneNumber: '0363333333',
  password: '123456',
  email: 'tantudinh2@gmail.com',
};

describe('User Controller', () => {
  let token: string,
    userId = 1;

  it('Create user', async () => {
    const res = await request.post('/api/users').send(userTest);
    const { body, status } = res;
    userId = body.id;
    expect(status).toBe(200);
    expect(body.username).toBe(userTest.username);
  });

  it('Log in', async () => {
    const res = await request.post('/api/users/login').send({
      username: userTest.username,
      password: userTest.password,
    });
    const { body, status } = res;
    token = body.token;

    expect(status).toBe(200);
  });

  it('Get list users', async () => {
    const res = await request.get('/api/users').set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Get user detail', async () => {
    const res = await request.get(`/api/users/${userId}`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Update user', async () => {
    const newUserData: Omit<User, 'id'> = {
      ...userTest,
      fullName: 'Vikir',
    };

    const res = await request
      .put(`/api/users/${userId}`)
      .send(newUserData)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
  });

  it('Reject with wrong password', async () => {
    const res = await request
      .post('/api/users/log-in')
      .send({
        username: userTest.username,
        password: '1234567890',
      })
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(404);
  });

  it('Delete user', async () => {
    const res = await request.delete(`/api/users/${userId}`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });
});
