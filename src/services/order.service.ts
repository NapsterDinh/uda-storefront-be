import { Order, OrderProduct, PayloadCreateOrder, PayloadUpdateOrder } from '../models/order.model';
import { databaseClient } from './database.service';

async function getOrderById(id: number) {
  try {
    const query = 'SELECT * FROM orders where orders.id = $1';
    const result = await databaseClient.executeQuery(query, [id]);

    const orderWithProductQuery = 'SELECT * FROM order_products WHERE order_id = $1';
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

async function getOrdersByUser(id: number) {
  try {
    const sql = 'SELECT * FROM orders WHERE user_id = $1';
    const result = await databaseClient.executeQuery(sql, [id]);

    const productOrderSql = 'SELECT product_id, quantity FROM order_products WHERE order_id= $1';
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

async function createOrder(newOrderPayload: PayloadCreateOrder) {
  const { products, user_id } = newOrderPayload;

  try {
    const sql = 'INSERT INTO orders (user_id) VALUES($1) RETURNING *';
    const result = await databaseClient.executeQuery(sql, [user_id]);
    const order = result?.rows?.[0];

    const order_productsSql =
      'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
    const order_products: OrderProduct[] = [];
    for (const product of products) {
      const { product_id, quantity } = product;
      const result2 = await databaseClient.executeQuery(order_productsSql, [order.id, product_id, quantity]);
      order_products.push(result2?.rows?.[0]);
    }

    const newOrder: Order = {
      ...order,
      products: order_products,
    };
    return newOrder;
  } catch (err) {
    throw new Error('Has error occur!!');
  }
}

async function getAllOrders() {
  try {
    const sql = 'SELECT * FROM orders';
    const result = await databaseClient.executeQuery(sql);

    if (!result?.rows?.[0]) return;

    const productOrderSql = 'SELECT product_id, quantity FROM order_products WHERE order_id= $1';
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

async function updateOrder(id: number, newUpdatedOrderData: PayloadUpdateOrder) {
  const { products } = newUpdatedOrderData;

  try {
    const order_products: OrderProduct[] = [];

    for (const product of products) {
      //if order product line has been exist
      let result1;
      if (product.id) {
        result1 = await databaseClient.executeQuery(
          'UPDATE order_products SET product_id = $1, quantity = $2 WHERE id = $3 RETURNING *',
          [product.product_id, product.quantity, product.id],
        );
      } else {
        result1 = await databaseClient.executeQuery(
          'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *',
          [id, product.product_id, product.quantity],
        );
      }

      order_products.push(result1?.rows?.[0]);
    }

    const result2 = await databaseClient.executeQuery('Select * from orders where orders.id = $1', [id]);
    if (!result2?.rows?.[0]) {
      throw new Error('Has error occur!!');
    }

    return {
      ...result2?.rows?.[0],
      products: order_products,
    };
  } catch (err) {
    throw new Error('Has error occur!!');
  }
}

async function deleteOrderById(id: number) {
  try {
    const order_productsSql = 'DELETE FROM order_products WHERE order_id = $1 RETURNING *';
    const result = await databaseClient.executeQuery(order_productsSql, [id]);
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

export const orderService = {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  deleteOrderById
}