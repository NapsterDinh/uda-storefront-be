import {agent as supertest} from 'supertest';
import { User } from '../../models/user.model';
import app from '../..';

const request = supertest(app);

export const userTest: Omit<User, 'id'> = {
  username: `uda-tsu-${Date.now}`,
  fullName: 'Dinh Napster Tu',
  phoneNumber: '0363333333',
  password: '123456',
  email: 'tantudinh2@gmail.com',
};

describe('User Controller', () => {
  let token: string = '',
    user_id = 1;
  
  beforeAll(async() => {
    const res = await request.post('/api/v1/auth/register').send(userTest);
    
    const res1 = await request.post('/api/v1/auth/login').send({
      username: userTest.username,
      password: userTest.password,
    });
    const { body } = res1
    
    user_id = body.id;
    token = body.token;
  })
    
  it('Log in', async () => {
    const res = await request.post('/api/v1/auth/login').send({
      username: userTest.username,
      password: userTest.password,
    });
    const { status } = res;
    expect(status).toBe(200);
  });
  
  it('Get list users', async () => {
    const res = await request.set({'Authorization': `Bearer ${token}`}).get('/api/v1/user');
    expect(res.status).toBe(200);
  });

  it('Get user detail', async () => {
    const res = await request.set({'Authorization': `Bearer ${token}`}).get(`/api/v1/user/${user_id}`)
    expect(res.status).toBe(200);
  });

  it('Update user', async () => {
    const newUserData: Omit<User, 'id'> = {
      ...userTest,
      fullName: 'Vikir',
    };

    const res = await request
      .set({'Authorization': `Bearer ${token}`})
      .put(`/api/v1/user/${user_id}`)
      .send(newUserData)

    expect(res.status).toBe(200);
  });

  it('Reject with wrong password', async () => {
    const res = await request
      .set({'Authorization': `Bearer ${token}`})
      .post('/api/v1/auth/login')
      .send({
        username: userTest.username,
        password: '1234567890',
      })

    expect(res.status).toBe(404);
  });
  
  it('Delete user it', async () => {
    const res1 = await request.post('/api/v1/auth/register').send({...userTest, username: `tsu-${Date.now()}`});
    const {body} = res1
    const authRequest = request.set({'Authorization': `Bearer ${token}`})
    const res2 = await authRequest.delete(`/api/v1/user/${body.createUser.id}`);
    expect(res2.status).toBe(200);
  });
});