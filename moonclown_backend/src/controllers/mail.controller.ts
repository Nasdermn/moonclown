import { Request, Response, NextFunction } from 'express';
import mailService from '../services/mail.service';

class MailController {
  async sendCode(req: Request, res: Response, next: NextFunction) {
    const userEmail = req.body.email;
    try {
      await mailService.sendCode(userEmail);
      res.status(200).json({ message: 'Код подтверждения успешно отправлен.' });
    } catch (error) {
      next(error);
    }
  }

  async checkCode(req: Request, res: Response, next: NextFunction) {
    const { email, code } = req.body;
    try {
      const result = await mailService.checkCode(email, code);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const { email, name, message } = req.body;
    try {
      await mailService.sendMessage(email, name, message);
      res.status(200).json({ message: 'Письмо успешно отправлено.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new MailController();
