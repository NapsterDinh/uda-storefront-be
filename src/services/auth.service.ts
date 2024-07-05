import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { generateToken } from '../helpers/auth.helper';
import { userService } from './user.service';

async function authenticate(props: { username: string; password: string }) {
  const { password, username } = props;

  try {
    const result = await userService.getUser(username);
    if (result) {
      const { password: hashedPassword, ...user }: User = result;

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

export const authService = {
  authenticate
}