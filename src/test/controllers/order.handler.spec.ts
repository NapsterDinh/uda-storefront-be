import supertest from 'supertest';
import app from '../..';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';

const request = supertest(app);

const userTest: Omit<User, 'id'> = {
  username: `uda-tsu-${Date.now()}`,
  fullName: 'Dinh Napster Tu',
  phoneNumber: '0363333333',
  password: '123456',
  email: 'tantudinh2@gmail.com',
};

const productTest: Omit<Product, 'id'> = {
  name: 'Macbook Pro M2 2022',
  price: 27000000,
};

describe('Order Controller', () => {
  let token: string, productId: number, userId: number, orderId: number;

  beforeAll(async () => {
    // Create a new user and login
    const res = await request.post('/api/users/register').send(userTest);
    userId = res.body.id;

    const loginRes = await request.post('/api/users/login').send({
      username: userTest.username,
      password: userTest.password,
    });
    token = loginRes?.body.token;

    // Create sample product
    const productRes = await request
      .post('/api/products')
      .send(productTest)
      .set('Authorization', 'Bearer ' + token);
    productId = productRes?.body?.id;
  });

  afterAll(async () => {
    // Delete product
    await request.delete(`/api/products/${productId}`).set('Authorization', 'bearer ' + token);

    // Delete user
    await request.delete(`/api/users/${userId}`).set('Authorization', 'bearer ' + token);
  });

  it('Create order', async () => {
    const sampleOrder = {
      user_id: userId,
      products: [
        {
          product_id: productId,
          quantity: 5,
        },
      ],
    };

    const res = await request
      .post('/api/orders')
      .set('Authorization', 'Bearer ' + token)
      .send(sampleOrder);

    orderId = res.body.id;

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...sampleOrder,
      id: res?.body.id,
    });
  });

  it('Get all order', async () => {
    const res = await request.get('/api/orders').set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Get order detail', async () => {
    const res = await request.get(`/api/orders/${orderId}`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Delete order', async () => {
    const res = await request.delete(`/api/orders/${orderId}`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });
});
