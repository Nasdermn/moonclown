import { Router } from 'express';
import usersController from '../controllers/users.controller';
import imgUpload from '../middlewares/imageUpload.middleware';
import {
  nameValidation,
  passwordsValidation,
} from '../middlewares/validate.middleware';

const usersRouter = Router();

usersRouter.get('/me', usersController.getUser);
usersRouter.patch('/me/name', nameValidation, usersController.updateName);
usersRouter.patch(
  '/me/avatar',
  imgUpload.single('image'),
  usersController.updateAvatar,
);
usersRouter.patch(
  '/me/password',
  passwordsValidation,
  usersController.updatePassword,
);

export default usersRouter;
