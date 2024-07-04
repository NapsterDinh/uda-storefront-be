import { Request, Response } from 'express';
import { PayloadCreateProduct, PayloadUpdateProduct } from '../models/product.model';
import { productService } from '../services/product.service';

export default class ProductController {
  public async getAllProducts(_: Request, res: Response) {
    try {
      const listProduct = await productService.getAllProducts();
      res.status(200).json({ listProduct });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async getProductById(req: Request, res: Response) {
    const {id} = req.params;
    
    try {
      const product = await productService.getProductById(Number(id));
      if(!product?.rows?.[0]){
        return res.status(400).send(`product: ${id} does not exist!!!`);
      }
      res.status(200).json({ product: product?.rows?.[0] });
    } catch (error) {
      return res.status(400).send(`product: ${id} does not exist!!!`);
    }
  }
  public async createProduct(req: Request, res: Response) {
    const payload: PayloadCreateProduct = req.body;
    try {
      const product = await productService.createProduct(payload);
      if(!product){
        return res.status(400).send('Has error occur. Try again');
      }
      res.status(200).json({ product });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async updateProduct(req: Request, res: Response) {
    const payload: PayloadUpdateProduct = req.body;
    const {id} = req.params;
    try {
      const product = await productService.updateProduct(Number(id), payload);
      res.status(200).json({ product });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async deleteProductById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const isSuccess = await productService.deleteProductById(Number(id));
      if(isSuccess){
        return res.status(200).send("delete successfully");
      }
      return res.status(400).send('Has error occur. Try again');
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
}
