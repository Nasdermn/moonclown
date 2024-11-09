import { Request, Response, NextFunction } from "express";
import usersService from "../services/users.service";
import BadRequestError from "../utils/errors/BadRequestError";

class UsersController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as any).user._id;
      const user = await usersService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateName(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as any).user._id;
      const { name } = req.body;
      const user = await usersService.updateName(id, name);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as any).user._id;
      const { oldPassword, newPassword } = req.body;
      await usersService.updatePassword(id, oldPassword, newPassword);
      res.status(200).json({ message: "Пароль успешно изменён." });
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as any).user._id;
      if (!req.file) {
        throw new BadRequestError("Фотография не загружена.");
      }
      const avatar = req.file.filename;
      const updatedUser = await usersService.updateAvatar(id, avatar);
      res.status(200).json({ message: "Аватар обновлен", user: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsersController();
