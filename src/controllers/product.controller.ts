import { Request, Response } from 'express';
import { PayloadCreateProduct, PayloadUpdateProduct } from '../models/product.model';
import { ProductService } from '../services/product.service';

export default class ProductController {
  private productService = new ProductService();

  public async getAllProducts(_: Request, res: Response) {
    try {
      const listProduct = await this.productService.getAllProducts();
      res.status(200).json({ listProduct });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async getProductById(req: Request, res: Response) {
    const id = req.params;
    try {
      const product = await this.productService.getProductById(Number(id));
      res.status(200).json({ product });
    } catch (error) {
      return res.status(400).send(`product: ${id} does not exist!!!`);
    }
  }
  public async createProduct(req: Request, res: Response) {
    const payload: PayloadCreateProduct = req.body;
    try {
      const product = await this.productService.createProduct(payload);
      res.status(200).json({ product });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async updateProduct(req: Request, res: Response) {
    const payload: PayloadUpdateProduct = req.body;
    const id = req.params;
    try {
      const product = await this.productService.updateProduct(Number(id), payload);
      res.status(200).json({ product });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async deleteProductById(req: Request, res: Response) {
    const id = req.params;
    try {
      const isSuccess = await this.productService.deleteProductById(Number(id));
      isSuccess && res.status(200);
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
}
