import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import userModel from '../models/user.model';
import NotFoundError from '../utils/errors/NotFoundError';
import BadRequestError from '../utils/errors/BadRequestError';
import { SALT_ROUNDS } from '../utils/constants';

class UsersService {
  private async deleteImage(imageName: string) {
    try {
      const imagePath = path.join(__dirname, '../..', 'images', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.warn(`Файл не найден: ${imagePath}`);
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await userModel.findById(id).orFail();
      return user;
    } catch (error: any) {
      if (error.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else if (error.name === 'CastError') {
        throw new BadRequestError(
          'Пользователя с указанным _id не существует.',
        );
      } else {
        throw error;
      }
    }
  }

  async updateName(id: string, name: string) {
    try {
      const user = await userModel
        .findByIdAndUpdate(
          id,
          { name },
          {
            new: true,
            runValidators: true,
          },
        )
        .orFail(() => {
          throw new NotFoundError('Пользователь с указанным _id не найден');
        });
      return user;
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw new BadRequestError(
          'Указаны некорректные данные при обновлении имени',
        );
      } else {
        throw error;
      }
    }
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    try {
      const user = await userModel.findById(id).select('+password');

      if (!user) {
        throw new BadRequestError('Пользователь не найден');
      }

      const matched = await bcrypt.compare(oldPassword, user.password);

      if (!matched) {
        throw new BadRequestError('Старый пароль введён неправильно');
      }

      const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await userModel.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true, runValidators: true },
      );
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw new BadRequestError(
          'Указаны некорректные данные при обновлении пароля',
        );
      } else {
        throw error;
      }
    }
  }

  async updateAvatar(id: string, avatar: string) {
    try {
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        throw new NotFoundError('Пользователь не найден.');
      }
      if (existingUser.avatar !== 'default.png') {
        await this.deleteImage(existingUser.avatar);
      }
      existingUser.avatar = avatar;
      const updatedUser = await existingUser.save();
      return updatedUser;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new UsersService();
