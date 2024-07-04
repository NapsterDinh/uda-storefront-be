import {agent as supertest} from 'supertest';
import app from '../..';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { userTest } from './user.controller.spec';

const request = supertest(app);

export const productTest: Omit<Product, 'id'> = {
  name: 'Macbook Pro M2 2022',
  price: 27000,
};

describe('Product Controller', () => {
  let token: string, product_id: number;

  beforeAll(async () => {
    const username = `uda-tsu-${Date.now()}`
    const res = await request.post('/api/v1/auth/register').send({...userTest, username });

    const loginRes = await request.post('/api/v1/auth/login').send({
        username: username,
        password: userTest.password,
      });
      token = loginRes?.body.token;

    const res1 = await request
      .set({'Authorization': `Bearer ${token}`})
      .post('/api/v1/product')
      .send(productTest)

    product_id = res1?.body?.product?.id;
  });

  it('Get all products', async () => {
    const res = await request.set({'Authorization': `Bearer ${token}`}).get('/api/v1/product');
    expect(res.status).toBe(200);
  });

  it('Get product detail', async () => {
    const res = await request.set({'Authorization': `Bearer ${token}`}).get(`/api/v1/product/${product_id}`);
    expect(res.status).toBe(200);
  });

  it('Update product', async () => {
    const newProductData: Omit<Product, 'id'> = {
      name: 'Iphone 15',
      price: 32000000,
    };

    const res = await request
      .set({'Authorization': `Bearer ${token}`})
      .put(`/api/v1/product/${product_id}`)
      .send(newProductData)

    expect(res.status).toBe(200);
  });  
  
  it('Delete product it', async () => {
    const res1 = await request
      .set({'Authorization': `Bearer ${token}`})
      .post('/api/v1/product')
      .send({...productTest, name: 'IPad prod 2022'})
    expect(res1.status).toBe(200);
  });
});
