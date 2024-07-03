import { PayloadCreateProduct, PayloadUpdateProduct } from '../models/product.model';
import { databaseClient } from './database.service';

export class ProductService {
  async getProduct(productName: string) {
    try {
      const sql = {
        text: "Select * from products where products.name like '%{1}%'",
        values: [productName],
      };
      return await databaseClient.executeQuery(sql.text, sql.values);
    } catch (e) {
      throw new Error('Has error occur!!');
    }
  }

  async getProductById(id: number) {
    try {
      const sql = {
        text: 'Select * from products where products.id = {1}',
        values: [id],
      };
      return await databaseClient.executeQuery(sql.text, sql.values);
    } catch (e) {
      throw new Error('Has error occur!!');
    }
  }

  async createProduct(newProductPayload: PayloadCreateProduct) {
    try {
      const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const resultCreateProduct = await databaseClient.executeQuery(sql, [
        newProductPayload.name,
        newProductPayload.price,
      ]);

      const createdProduct = resultCreateProduct?.rows?.[0];
      if (!createdProduct) {
        throw new Error(`Cannot create new product with name: ${newProductPayload.name}`);
      }

      return createdProduct;
    } catch (e) {
      throw new Error('Can not create product');
    }
  }

  async getAllProducts() {
    try {
      const sql = 'Select * from products';
      const result = await databaseClient.executeQuery(sql);
      return result?.rows ?? [];
    } catch (err) {
      throw new Error(`Get products error. ${err}`);
    }
  }

  async updateProduct(id: number, newUpdatedProductData: PayloadUpdateProduct) {
    try {
      const sql = 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
      const result = await databaseClient.executeQuery(sql, [
        newUpdatedProductData.name,
        newUpdatedProductData.price,
        id,
      ]);
      if (!result?.rows[0]) return null;
      return result?.rows[0];
    } catch (err) {
      throw new Error('Can not update Product');
    }
  }
  async deleteProductById(id: number) {
    try {
      const sql = 'DELETE FROM products WHERE id=$1';
      await databaseClient.executeQuery(sql, [id]);
      return true;
    } catch (err) {
      throw new Error('Can not delete product');
    }
  }
}
