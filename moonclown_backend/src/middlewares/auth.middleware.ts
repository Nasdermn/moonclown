import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../utils/errors/UnauthorizedError';
import { config } from 'dotenv';
config();

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(
      'Ваш jwt-токен истёк. Пожалуйста, обновите страницу и авторизуйтесь.',
    );
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.SECRET_KEY as string);
  } catch (err) {
    throw new UnauthorizedError(
      'Ваш jwt-токен истёк. Пожалуйста, обновите страницу и авторизуйтесь.',
    );
  }

  (req as any).user = payload as jwt.JwtPayload;
  next();
};

export default authMiddleware;
