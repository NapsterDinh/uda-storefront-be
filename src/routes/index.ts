import express from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import productRouter from './product.route';
import orderRouter from './order.route';

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);

export default router;
