export interface Product {
  id: number;
  name: string;
  price: number;
}

export type PayloadCreateProduct = Omit<Product, 'id'>;

export type PayloadUpdateProduct = Product;
