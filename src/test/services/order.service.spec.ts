import { Order, PayloadCreateOrder } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import { orderService } from '../../services/order.service';
import { productService } from '../../services/product.service';
import { userService } from '../../services/user.service';
import { generateOrder } from '../controllers/order.controller.spec';
import { generateProduct } from '../controllers/product.controller.spec';
import { generateUserTest } from '../controllers/user.controller.spec';

describe('Order Service', () => {
  let orderSample: Order | undefined, userSample: User | undefined, productSample: Product | undefined;

  beforeAll(async () => {
    const userTestPayload = generateUserTest(`uda-tsu-user-service-${Math.random()}`)
    userSample = await userService.createUser(userTestPayload);
  
    const productPayload = generateProduct(`uda-tsu-product-service-${Math.random()}`);
    productSample = await productService.createProduct(productPayload);
    
    if(!userSample?.id || !productSample?.id) return
    
    const orderTest = generateOrder(userSample?.id, productSample?.id);
    orderSample = await orderService.createOrder(orderTest);
  });

  it('should get list orders', async () => {
    const result = await orderService.getAllOrders();
    expect(result?.length).toBeGreaterThan(0);
  });
  
  it('should get the order correctly by id', async () => {
    if(!orderSample) return
    const order = await orderService.getOrderById(orderSample.id);
    expect(order?.id).toEqual(orderSample.id);
  });
  
  it('should remove the order', async () => {
    const userTestPayload = generateUserTest(`uda-tsu-user-service-${Math.random()}`)
    const userTest = await userService.createUser(userTestPayload);
  
    const productPayload = generateProduct(`uda-tsu-product-service-${Math.random()}`);
    const productTest = await productService.createProduct(productPayload);
    
    if(!userTest?.id || !productTest?.id) return
    
    const orderTestPayload = generateOrder(userTest?.id, productTest?.id);
    const orderTest = await orderService.createOrder(orderTestPayload);
    if(!orderTest?.id) return
    // Delete created user
    const isSuccess = await orderService.deleteOrderById(orderTest.id);
    expect(isSuccess).toBeTrue();
  });
});
