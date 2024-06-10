import { Router } from 'express';
import mailController from '../controllers/mail.controller';
import {
  emailValidation,
  checkCodeValidation,
  sendMessageValidation,
} from '../middlewares/validate.middleware';
const mailRouter = Router();

mailRouter.post('/code/send', emailValidation, mailController.sendCode);
mailRouter.post('/code/check', checkCodeValidation, mailController.checkCode);
mailRouter.post('/message', sendMessageValidation, mailController.sendMessage);
export default mailRouter;
