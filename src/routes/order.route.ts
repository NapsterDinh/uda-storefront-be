import express from 'express';
import { verifyToken } from '../helpers/auth.helper';
import OrderController from '../controllers/order.controller';

const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.get('/', verifyToken, orderController.getAllOrder);
orderRouter.get('/:id', verifyToken, orderController.getOrderById);
orderRouter.get('/user/:id', verifyToken, orderController.getOrderByIdUser);
orderRouter.post('', verifyToken, orderController.createOrder);
orderRouter.put('/:id', verifyToken, orderController.updateOrder);
orderRouter.delete('/:id', verifyToken, orderController.deleteOrderById);

export default orderRouter;
