import express from 'express';
import { verifyToken } from '../helpers/auth.helper';
import ProductController from '../controllers/product.controller';

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.post('', verifyToken, productController.createProduct);
productRouter.put('/:id', verifyToken, productController.updateProduct);
productRouter.delete('/:id', verifyToken, productController.deleteProductById);

export default productRouter;
