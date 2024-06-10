import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
    try {
      const user = await authService.registerUser(name, email, password);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await authService.loginUser(email, password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
