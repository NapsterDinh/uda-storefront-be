import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { PayloadCreateOrder, PayloadUpdateOrder } from '../models/order.model';

export default class OrderController {
  private orderService = new OrderService();

  public async getAllOrder(_: Request, res: Response) {
    try {
      const listOrder = await this.orderService.getAllOrders();
      res.status(200).json({ listOrder });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async getOrderById(req: Request, res: Response) {
    const id = req.params;
    try {
      const order = await this.orderService.getOrderById(Number(id));
      res.status(200).json({ order });
    } catch (error) {
      return res.status(400).send(`Order: ${id} does not exist!!!`);
    }
  }
  public async getOrderByIdUser(req: Request, res: Response) {
    const userId = req.params;
    try {
      const order = await this.orderService.getOrderById(Number(userId));
      res.status(200).json({ order });
    } catch (error) {
      return res.status(400).send(`Order with userId: ${userId} does not exist!!!`);
    }
  }
  public async createOrder(req: Request, res: Response) {
    const payload: PayloadCreateOrder = req.body;
    try {
      const order = await this.orderService.createOrder(payload);
      res.status(200).json({ order });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async updateOrder(req: Request, res: Response) {
    const payload: PayloadUpdateOrder = req.body;
    const id = req.params;
    try {
      const order = await this.orderService.updateOrder(Number(id), payload);
      res.status(200).json({ order });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async deleteOrderById(req: Request, res: Response) {
    const id = req.params;
    try {
      const isSuccess = await this.orderService.deleteOrderById(Number(id));
      isSuccess && res.status(200);
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
}
