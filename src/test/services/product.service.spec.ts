import { Product } from '../../models/product.model';
import { productService } from '../../services/product.service';
import { generateProduct } from '../controllers/product.controller.spec';

describe('Product Service', () => {
  let productSample: Product | undefined;
  
  beforeAll(async () => {
    const productTest = generateProduct(`uda-tsu-product-service-${Math.random()}`);
    productSample = await productService.createProduct(productTest);
  });
  
  it('should get list products', async () => {
    const result = await productService.getAllProducts();
    expect(result?.length).toBeGreaterThan(0);
  });
  
  it('should get the product correctly by id', async () => {
    if(!productSample) return
    const product = await productService.getProductById(productSample.id);
    expect(product?.id).toEqual(productSample.id);
  });
  
  it('should remove the product', async () => {
    // Create a new user
    const productTest = generateProduct(`uda-tsu-product-service-${Math.random()}`)
    const testDeleteProduct = await productService.createProduct(productTest);
    if(!testDeleteProduct?.id) return
    // Delete created user
    const isSuccess = await productService.deleteProductById(testDeleteProduct.id);
    expect(isSuccess).toBeTrue();
  });
});
