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

describe('Product Controller', () => {
  let token: string, userId: number, productId: number;

  beforeAll(async () => {
    const res = await request.post('/api/users').send(userTest);
    userId = res.body.id;

    const loginRes = await request.post('/api/users/login').send({
      username: userTest.username,
      password: userTest.password,
    });
    token = loginRes?.body.token;
  });

  afterAll(async () => {
    await request.delete(`/api/users/${userId}`).set('Authorization', 'bearer ' + token);
  });

  it('Create product', async () => {
    const res = await request
      .post('/api/products')
      .send(productTest)
      .set('Authorization', 'Bearer ' + token);

    productId = res?.body?.id;
    expect(res.status).toBe(200);
  });

  it('Get all products', async () => {
    const res = await request.get('/api/products');
    expect(res.status).toBe(200);
  });

  it('Get product detail', async () => {
    const res = await request.get(`/api/products/${productId}`);
    expect(res.status).toBe(200);
  });

  it('Update product', async () => {
    const newProductData: Omit<Product, 'id'> = {
      name: 'Iphone 15',
      price: 32000000,
    };
    const res = await request
      .put(`/api/products/${productId}`)
      .send(newProductData)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
  });

  it('Delete product', async () => {
    const res = await request.delete(`/api/products/${productId}`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });
});
