import express from 'express';
import { default as UserController } from '../controllers/user.controller';
import { verifyToken } from '../helpers/auth.helper';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', verifyToken, userController.getAllUser);
userRouter.get('/:id', verifyToken, userController.getUserById);
userRouter.put('/:id', verifyToken, userController.updateUser);
userRouter.delete('/:id', verifyToken, userController.deleteUserById);

export default userRouter;
