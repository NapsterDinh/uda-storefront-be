export interface OrderProduct {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  products: OrderProduct[];
  user_id: number;
}

export type PayloadCreateOrder = Omit<Order, 'id' | 'products'> & {
  products: Omit<OrderProduct, 'id' | 'order_id'>[];
};

export type PayloadUpdateOrder = Order;
