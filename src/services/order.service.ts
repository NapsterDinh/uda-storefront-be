import { Order, OrderProduct, PayloadCreateOrder, PayloadUpdateOrder } from '../models/order.model';
import { databaseClient } from './database.service';

export class OrderService {
  async getOrderById(id: number) {
    try {
      const query = 'SELECT * FROM orders where orders.id = $1';
      const result = await databaseClient.executeQuery(query, [id]);

      const orderWithProductQuery = 'SELECT * FROM orderProducts WHERE orderId = $1';
      const result2 = await databaseClient.executeQuery(orderWithProductQuery, [id]);

      if (!result?.rows?.[0]) {
        return;
      }

      return {
        ...result.rows[0],
        products: result2?.rows ?? [],
      };
    } catch (e) {
      throw new Error('Has error occur!!');
    }
  }

  async getOrdersByUser(id: number) {
    try {
      const sql = 'SELECT * FROM orders WHERE userId = $1';
      const result = await databaseClient.executeQuery(sql, [id]);

      const productOrderSql = 'SELECT productId, quantity FROM orderProducts WHERE orderId= $1';
      const orders: Order[] = [];
      for (const order of result?.rows) {
        const result2 = await databaseClient.executeQuery(productOrderSql, [order.id]);
        orders.push({
          ...order,
          products: result2?.rows,
        });
      }

      return orders;
    } catch (err) {
      throw new Error(`Can not get orders. ${err}`);
    }
  }

  async createOrder(newOrderPayload: PayloadCreateOrder) {
    const { products, userId } = newOrderPayload;

    try {
      const sql = 'INSERT INTO orders (userId) VALUES($1) RETURNING *';
      const result = await databaseClient.executeQuery(sql, [userId]);
      const order = result?.rows?.[0];

      const orderProductsSql =
        'INSERT INTO orderProducts (orderId, productId, quantity) VALUES($1, $2, $3) RETURNING *';
      const orderProducts: OrderProduct[] = [];
      for (const product of products) {
        const { productId, quantity } = product;
        const result2 = await databaseClient.executeQuery(orderProductsSql, [order.id, productId, quantity]);
        orderProducts.push(result2?.rows?.[0]);
      }

      const newOrder: Order = {
        ...order,
        products: orderProducts,
      };
      return newOrder;
    } catch (err) {
      throw new Error('Has error occur!!');
    }
  }

  async getAllOrders() {
    try {
      const sql = 'SELECT * FROM orders';
      const result = await databaseClient.executeQuery(sql);

      if (!result?.rows?.[0]) return;

      const productOrderSql = 'SELECT productId, quantity FROM orderProducts WHERE orderId= $1';
      const orders: Order[] = [];
      for (const order of result?.rows) {
        const result2 = await databaseClient.executeQuery(productOrderSql, [order.id]);
        orders.push({
          ...order,
          products: result2?.rows,
        });
      }

      return orders;
    } catch (err) {
      throw new Error('Has error occur!!');
    }
  }

  async updateOrder(id: number, newUpdatedOrderData: PayloadUpdateOrder) {
    const { products } = newUpdatedOrderData;

    try {
      const orderProducts: OrderProduct[] = [];

      for (const product of products) {
        //if order product line has been exist
        let result1;
        if (product.id) {
          result1 = await databaseClient.executeQuery(
            'UPDATE orderProducts SET productId = $1, quantity = $2 WHERE id = $3 RETURNING *',
            [product.productId, product.quantity, product.id],
          );
        } else {
          result1 = await databaseClient.executeQuery(
            'INSERT INTO orderProducts (orderId, productId, quantity) VALUES($1, $2, $3) RETURNING *',
            [id, product.productId, product.quantity],
          );
        }

        orderProducts.push(result1?.rows?.[0]);
      }

      const result2 = await databaseClient.executeQuery('Select * from orders where orders.id = $1', [id]);
      if (!result2?.rows?.[0]) {
        throw new Error('Has error occur!!');
      }

      return {
        ...result2?.rows?.[0],
        products: orderProducts,
      };
    } catch (err) {
      throw new Error('Has error occur!!');
    }
  }

  async deleteOrderById(id: number) {
    try {
      const orderProductsSql = 'DELETE FROM orderProducts WHERE orderId = $1 RETURNING *';
      const result = await databaseClient.executeQuery(orderProductsSql, [id]);
      const deletedOrder = result?.rows?.[0];
      if (!deletedOrder) {
        throw new Error('Order not found');
      }

      const sql = 'DELETE FROM orders WHERE id= $1';
      await databaseClient.executeQuery(sql, [id]);

      return true;
    } catch (err) {
      throw new Error('Has error occur!!');
    }
  }
}
