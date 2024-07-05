import { Request, Response } from 'express';
import { PayloadCreateOrder, PayloadUpdateOrder } from '../models/order.model';
import { orderService } from '../services/order.service';

export default class OrderController {
  public async getAllOrder(_: Request, res: Response) {
    try {
      const listOrder = await orderService.getAllOrders();
      res.status(200).json({ listOrder });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async getOrderById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const order = await orderService.getOrderById(Number(id));
      if(!order)
      {
        return res.status(400).send(`Order: ${id} does not exist!!!`);
      }
      res.status(200).json(order);
    } catch (error) {
      return res.status(400).send(`Order: ${id} does not exist!!!`);
    }
  }
  public async getOrderByIdUser(req: Request, res: Response) {
    const userId = req.params;
    try {
      const order = await orderService.getOrderById(Number(userId));
      if(!order){
        return res.status(400).send(`Order with userId: ${userId} does not exist!!!`);
      }
      res.status(200).json(order);
    } catch (error) {
      return res.status(400).send(`Order with userId: ${userId} does not exist!!!`);
    }
  }
  public async createOrder(req: Request, res: Response) {
    const payload: PayloadCreateOrder = req.body;
    try {
      const order = await orderService.createOrder(payload);
      if(!order){
        return res.status(400).send('Has error occur. Try again');
      }
      res.status(200).json(order);
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async updateOrder(req: Request, res: Response) {
    const payload: PayloadUpdateOrder = req.body;
    const {id} = req.params;
    try {
      const order = await orderService.updateOrder(Number(id), payload);
      if(!order){
        return res.status(400).send('Has error occur. Try again');
      }
      res.status(200).json(order);
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async deleteOrderById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const isSuccess = await orderService.deleteOrderById(Number(id));
      if(isSuccess){
        return res.status(200).send("delete successfully");
      }
      return res.status(400).send('Has error occur. Try again');
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
}
