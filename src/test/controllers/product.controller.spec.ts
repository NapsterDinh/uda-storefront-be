import { agent as supertest } from 'supertest';
import app from '../..';
import { Product } from '../../models/product.model';
import { generateUserTest } from './user.controller.spec';
import { User } from '../../models/user.model';

const request = supertest(app);

export const generateProduct = (newProductName?: string) => {
  const userTest: Omit<Product, 'id'> = {
    name: newProductName || `uda-tsu-product-controller-${Math.random}`,
    price: 2000,
  };
  return userTest;
};

describe('Product Controller', () => {
  let userLogin: User & { token: string }, productDefault: Product;

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
  });

  it('Get all products', async () => {
    const res = await request.set({ Authorization: `Bearer ${userLogin.token}` }).get('/api/v1/product');
    expect(res.status).toBe(200);
  });

  it('Get product detail', async () => {
    const res = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .get(`/api/v1/product/${productDefault.id}`);
    expect(res.status).toBe(200);
  });

  it('Delete product it', async () => {
    const productTest = generateProduct(`tsu-product-controller-test-delete-${Math.random()}`);

    const res = await request
      .set({ Authorization: `Bearer ${userLogin.token}` })
      .post('/api/v1/product')
      .send(productTest);
    const result = await request.set({ Authorization: `Bearer ${userLogin.token}` }).delete(`/api/v1/product/${res.body.id}`);

    expect(result.status).toBe(200);
  });
});
