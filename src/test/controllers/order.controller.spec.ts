import { agent as supertest } from 'supertest';
import app from '../..';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { userTest } from './user.controller.spec';
import { productTest } from './product.controller.spec';

const request = supertest(app);

describe('Order Controller', () => {
  let token: string, product_id: number, user_id: number, order_id: number;

  beforeAll(async () => {
    const username = `uda-tsu-${Date.now()}`;
    const res = await request.post('/api/v1/auth/register').send({ ...userTest, username });

    const loginRes = await request.post('/api/v1/auth/login').send({
      username: username,
      password: userTest.password,
    });
    token = loginRes?.body.token;
    user_id = loginRes?.body?.id;

    const resProduct = await request
      .set({ Authorization: `Bearer ${token}` })
      .post('/api/v1/product')
      .send(productTest);

    product_id = resProduct?.body?.product?.id;

    const sampleOrder = {
      user_id: user_id,
      products: [
        {
          product_id: product_id,
          quantity: 5,
        },
      ],
    };

    const res1 = await request
      .set({ Authorization: `Bearer ${token}` })
      .post('/api/v1/order')
      .send(sampleOrder);
    order_id = res1.body?.order.id;
  });

  it('Get all order', async () => {
    const authRequest = request.set({ Authorization: `Bearer ${token}` });
    const res = await authRequest.get('/api/v1/order');
    expect(res.status).toBe(200);
  });

  it('Get order detail', async () => {
    const authRequest = request.set({ Authorization: `Bearer ${token}` });

    const res = await authRequest.get(`/api/v1/order/${order_id}`);
    expect(res.status).toBe(200);
  });

  it('Delete order', async () => {
    const username = `uda-tsu-${Date.now()}`;
    const res = await request.post('/api/v1/auth/register').send({ ...userTest, username });

    const loginRes = await request.post('/api/v1/auth/login').send({
      username: username,
      password: userTest.password,
    });

    const resProduct = await request
      .set({ Authorization: `Bearer ${loginRes?.body.token}` })
      .post('/api/v1/product')
      .send({...productTest, name: 'samsung galaxy s20'});

    const sampleOrder = {
      user_id: loginRes?.body?.id,
      products: [
        {
          product_id: resProduct?.body?.product?.id,
          quantity: 5,
        },
      ],
    };

    const res1 = await request
      .set({ Authorization: `Bearer ${loginRes?.body.token}` })
      .post('/api/v1/order')
      .send(sampleOrder);

    const response = await request.set({ Authorization: `Bearer ${loginRes?.body.token}` }).delete(`/api/v1/order/${res1.body?.order.id}`);
    expect(response.status).toBe(200);
  });
});
