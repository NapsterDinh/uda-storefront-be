import { Request, Response } from 'express';
import { PayloadCreateUser } from '../models/user.model';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';

export default class AuthController {
  public async login(req: Request, res: Response) {
    const payload = req.body;
    const user = await authService.authenticate(payload);
    if(user) {
      return res.status(200).json(user);
    }
    res.status(404).json({
      message: "Wrong username or password!!!"
    })
  }

  public async register(req: Request, res: Response) {
    const payload: PayloadCreateUser = req.body;
    if (!payload.username || !payload.fullName || !payload.password || !payload.phoneNumber) {
      res.status(400).send('Please fill in completely user registration form!!!');
    }

    const createUser = await userService.createUser(payload);
    if (!createUser) {
      return res.status(400).send('Has error occur. Try again');
    }
    return res.status(200).send({
      createUser,
    });
  }
}
