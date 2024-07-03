import { Request, Response } from 'express';
import { PayloadCreateUser } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export default class AuthController {
  private userService = new UserService();
  private authService = new AuthService();

  public async login(req: Request, res: Response) {
    const payload = req.body;
    const user = await this.authService.authenticate(payload);
    res.json(user);
  }

  public async register(req: Request, res: Response) {
    const payload: PayloadCreateUser = req.body;
    if (!payload.username || !payload.fullName || !payload.password || !payload.phoneNumber) {
      res.status(400).send('Please fill in completely user registration form!!!');
    }

    const createUser = await this.userService.createUser(payload);
    if (!createUser) {
      return res.status(400).send('Has error occur. Try again');
    }
    return res.send({
      createUser,
    });
  }
}
