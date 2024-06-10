import { Router } from 'express';
import passwordController from '../controllers/password.controller';
import {
  emailValidation,
  passwordValidation,
} from '../middlewares/validate.middleware';

const passwordRouter = Router();

passwordRouter.post(
  '/recover',
  emailValidation,
  passwordController.recoverPassword,
);
passwordRouter.get('/check/:id/:token', passwordController.checkToken);
passwordRouter.post(
  '/update/:id/:token',
  passwordValidation,
  passwordController.resetPassword,
);

export default passwordRouter;
