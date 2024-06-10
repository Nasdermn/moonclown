import { Router } from 'express';
import authController from '../controllers/auth.controller';
import {
  loginValidation,
  registerValidation,
} from '../middlewares/validate.middleware';

const authRouter = Router();

authRouter.post('/signup', registerValidation, authController.registerUser);
authRouter.post('/signin', loginValidation, authController.loginUser);

export default authRouter;
