import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import NotFoundError from '../utils/errors/NotFoundError';

export const getImage = (req: Request, res: Response, next: NextFunction) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../..', 'images', filename);

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      throw new NotFoundError('Изображение отсутствует на сервере.');
    }
  } catch (error) {
    next(error);
  }
};
