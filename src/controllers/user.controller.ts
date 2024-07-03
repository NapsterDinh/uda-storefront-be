import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { PayloadUpdateUser } from '../models/user.model';

export default class UserController {
  private userService = new UserService();

  public async getAllUser(_: Request, res: Response) {
    try {
      const listUser = await this.userService.getAllUsers();
      res.status(200).json({ listUser });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async getUserById(req: Request, res: Response) {
    const id = req.params;
    try {
      const user = await this.userService.getUserById(Number(id));
      res.status(200).json({ user });
    } catch (error) {
      return res.status(400).send(`User: ${id} does not exist!!!`);
    }
  }
  public async updateUser(req: Request, res: Response) {
    const payload: PayloadUpdateUser = req.body;
    const id = req.params;
    try {
      const user = await this.userService.updateUser(Number(id), payload);
      res.status(200).json({ user });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async deleteUserById(req: Request, res: Response) {
    const id = req.params;
    try {
      const isSuccess = await this.userService.deleteUserById(Number(id));
      isSuccess && res.status(200);
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
}
