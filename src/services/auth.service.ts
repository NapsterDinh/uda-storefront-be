import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { generateToken } from '../helpers/auth.helper';

export class AuthService {
  private userService = new UserService();

  async authenticate(props: { username: string; password: string }) {
    const { password, username } = props;

    try {
      const result = await this.userService.getUser(username);
      if (result.rows.length) {
        const { password: hashedPassword, ...user }: User = result.rows[0];

        if (bcrypt.compareSync(password, hashedPassword)) {
          const token = generateToken({
            id: user.id,
            username: user.username,
          });
          return { ...user, token };
        }
      }
    } catch (e) {
      throw new Error('User is not registered');
    }
  }
}
