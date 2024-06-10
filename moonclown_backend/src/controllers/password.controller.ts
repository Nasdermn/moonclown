import { Request, Response, NextFunction } from 'express';
import passwordService from '../services/password.service';

class PasswordController {
  async recoverPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await passwordService.recoverPassword(email);
      res.status(200).json({
        status: 200,
        message:
          'Письмо с инструкциями по восстановлению пароля отправлено на вашу почту.',
      });
    } catch (error) {
      next(error);
    }
  }

  async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, token } = req.params;
      await passwordService.checkToken(id, token);
      res.status(200).json({ message: 'Токен действителен.' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, token } = req.params;
      const { password } = req.body;
      await passwordService.resetPassword(id, token, password);
      res.status(200).json({ message: 'Пароль успешно обновлен.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new PasswordController();
