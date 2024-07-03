import express from 'express';
import AuthController from '../controllers/auth.controller';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.get('/login', authController.login);
authRouter.post('/register', authController.register);

export default authRouter;
