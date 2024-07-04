import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { PayloadUpdateUser } from '../models/user.model';

export default class UserController {
  public async getAllUser(_: Request, res: Response) {
    try {
      const listUser = await userService.getAllUsers();
      res.status(200).json({ listUser });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async getUserById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const user = await userService.getUserById(Number(id));
      if(!user?.rows?.[0]){
        return res.status(400).send(`User: ${id} does not exist!!!`);
      }
      res.status(200).json({ user: user?.rows?.[0] });
    } catch (error) {
      return res.status(400).send(`User: ${id} does not exist!!!`);
    }
  }
  public async updateUser(req: Request, res: Response) {
    const payload: PayloadUpdateUser = req.body;
    const {id} = req.params;
    try {
      const user = await userService.updateUser(Number(id), payload);
      res.status(200).json({ user });
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
  public async deleteUserById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const isSuccess = await userService.deleteUserById(Number(id));
      if(isSuccess){
        return res.status(200).send("delete successfully");
      }
      return res.status(400).send('Has error occur. Try again');
    } catch (error) {
      return res.status(400).send('Has error occur. Try again');
    }
  }
}
