import { agent as supertest } from 'supertest';
import app from '../..';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import { generateProduct } from './product.controller.spec';
import { generateUserTest } from './user.controller.spec';

const request = supertest(app);

export const generateOrder = (userId: number, productId: number) => {
  return  {
    user_id: userId,
    products: [
      {
        product_id: productId,
        quantity: 5,
      },
    ],
  }
}

describe('Order Controller', () => {
  let userLogin: User & { token: string }, productDefault: Product, orderDefault: Order;

  beforeAll(async () => {
    const userTest = generateUserTest();
    await request.post('/api/v1/auth/register').send(userTest);
    const resLogin = await request.post('/api/v1/auth/login').send({
      username: userTest.username,
      password: userTest.password,
    });
    userLogin = {
      ...resLogin.body,
      password: userTest.password,
    };
    const productTest = generateProduct();

    const res1 = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .post('/api/v1/product')
      .send(productTest);

    productDefault = res1?.body;

    const sampleOrder = generateOrder(userLogin.id, productDefault.id)

    const resOrder = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .post('/api/v1/order')
      .send(sampleOrder);
    orderDefault = resOrder.body;
  });

  it('Get all order', async () => {
    const res = await request.set({ Authorization: `Bearer ${userLogin.token}` }).get('/api/v1/order');
    expect(res.status).toBe(200);
  });

  it('Get order detail', async () => {
    const res = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .get(`/api/v1/order/${orderDefault.id}`);
    expect(res.status).toBe(200);
  });

  it('Delete order', async () => {
    const sampleOrder = {
      user_id: userLogin.id,
      products: [
        {
          product_id: productDefault.id,
          quantity: 5,
        },
      ],
    };

    const res1 = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .post('/api/v1/order')
      .send(sampleOrder);

    const response = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .delete(`/api/v1/order/${res1.body.id}`);
    expect(response.status).toBe(200);
  });
});
