import { agent as supertest } from 'supertest';
import { User } from '../../models/user.model';
import app from '../..';

const request = supertest(app);
 
export const generateUserTest = (newUserName?: string) => {
  const userTest: Omit<User, 'id'> = {
    username: newUserName || `tsu-user-controller-${Math.random()}`,
    fullName: 'Dinh Napster Tu',
    phoneNumber: '0363333333',
    password: '123456',
    email: 'tantudinh2@gmail.com',
  };
  return userTest
}

describe('User Controller', () => {
  let userLogin: User &  {token: string};
  
  beforeAll(async() => {
    const userTest =  generateUserTest();
    await request.post('/api/v1/auth/register').send(userTest);
    const resLogin = await request.post('/api/v1/auth/login').send({
      username: userTest.username,
      password: userTest.password
    });
    userLogin = {
      ...resLogin.body,
      password: userTest.password
    }
  })

  it('Log in', async () => {
    const res = await request.post('/api/v1/auth/login').send({
      username: userLogin.username,
      password: userLogin.password
    });
    const { status } = res;
    expect(status).toBe(200);
  });

  it('Get list users', async () => {
    const res = await request.set({ Authorization: `Bearer ${userLogin.token}` }).get('/api/v1/user');
    expect(res.status).toBe(200);
  });

  it('Get user detail', async () => {
    const res = await request.set({ Authorization: `Bearer ${userLogin.token}` }).get(`/api/v1/user/${userLogin.id}`);
    expect(res.status).toBe(200);
  });

  it('Reject with wrong password', async () => {
    const res = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .post('/api/v1/auth/login')
      .send({
        username: userLogin.username,
        password: '1234567890',
      });

    expect(res.status).toBe(404);
  });

  it('Delete user it', async () => {
    const userTest = generateUserTest(`tsu-user-controller-test-delete-${Math.random()}`)
    await request.post('/api/v1/auth/register').send(userTest);

    const res1 = await request.post('/api/v1/auth/login').send({
      username: userTest.username,
      password: userTest.password
    });
    
    const token = res1.body.token
    const user_id = res1.body.id
    const res2 = await request.set({ Authorization: `Bearer ${token}` }).delete(`/api/v1/user/${user_id}`);
    expect(res2.status).toBe(200);
  });
});
