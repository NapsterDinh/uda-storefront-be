export interface OrderProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  products: OrderProduct[];
  userId: number;
}

export type PayloadCreateOrder = Omit<Order, 'id' | 'products'> & {
  products: Omit<OrderProduct, 'id' | 'orderId'>[];
};

export type PayloadUpdateOrder = Order;
