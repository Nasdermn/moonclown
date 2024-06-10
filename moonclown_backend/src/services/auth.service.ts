import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/user.model';
import ConflictError from '../utils/errors/ConflictError';
import BadRequestError from '../utils/errors/BadRequestError';
import { SALT_ROUNDS, MONGO_DUPLICATE_KEY_ERROR } from '../utils/constants';
import { config } from 'dotenv';
config();

class AuthService {
  async registerUser(name: string, email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await userModel.create({
        name,
        email,
        avatar: 'default.png',
        password: hashedPassword,
      });

      return user;
    } catch (error: any) {
      if (error.code === MONGO_DUPLICATE_KEY_ERROR) {
        throw new ConflictError(
          'Указанный email уже используется другим пользователем.',
        );
      } else {
        throw new BadRequestError(
          'Указаны некорректные данные при создании пользователя.',
        );
      }
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await userModel.findUserByCredentials(email, password);
      if (user) {
        const token = jwt.sign(
          { _id: user._id },
          process.env.SECRET_KEY as string,
          {
            expiresIn: '7d',
          },
        );
        return token;
      }
    } catch (error: any) {
      throw error;
    }
  }
}

export default new AuthService();
