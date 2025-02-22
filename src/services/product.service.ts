import { PayloadCreateProduct, PayloadUpdateProduct, Product } from '../models/product.model';
import { databaseClient } from './database.service';

async function getProduct(productName: string): Promise<Product |  undefined> {
  try {
    const sql = {
      text: "Select * from products where products.name like '%$1%'",
      values: [productName],
    };
    const result = await databaseClient.executeQuery(sql.text, sql.values);
    return result?.rows?.[0]
  } catch (e) {
    throw new Error('Has error occur!!');
  }
}

async function getProductById(id: number):Promise<Product |  undefined> {
  try {
    const sql = {
      text: 'Select * from products where products.id = $1',
      values: [id],
    };
    const result = await databaseClient.executeQuery(sql.text, sql.values);
    return result?.rows?.[0]
  } catch (e) {
    throw new Error('Has error occur!!');
  }
}

async function createProduct(newProductPayload: PayloadCreateProduct):Promise<Product |  undefined> {
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

async function getAllProducts():Promise<Product[]> {
  try {
    const sql = 'Select * from products';
    const result = await databaseClient.executeQuery(sql);
    return result?.rows ?? [];
  } catch (err) {
    throw new Error(`Get products error. ${err}`);
  }
}

async function updateProduct(id: number, newUpdatedProductData: PayloadUpdateProduct): Promise<Product |  undefined> {
  try {
    const sql = 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
    const result = await databaseClient.executeQuery(sql, [
      newUpdatedProductData.name,
      newUpdatedProductData.price,
      id,
    ]);
    return result?.rows?.[0];
  } catch (err) {
    throw new Error('Can not update Product');
  }
}
async function deleteProductById(id: number): Promise<boolean> {
  try {
    const sql = 'DELETE FROM products WHERE id=$1';
    const result = await databaseClient.executeQuery(sql, [id]);
    return !!result.rowCount
  } catch (err) {
    throw new Error('Can not delete product');
  }
}

export const productService = {
  getAllProducts,
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProductById
}
