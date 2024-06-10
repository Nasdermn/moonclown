import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { config } from 'dotenv';
import { ApiResponse } from '../utils/interfaces/kinopoisk.interface';

config();

const moviesApi = axios.create({
  baseURL: process.env.MOVIES_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.MOVIES_API_KEY,
  },
});

class KinopoiskController {
  async getMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const { searchQuery, page } = req.body;
      const response = await moviesApi.get<ApiResponse>(
        `/movie/search?page=${Number(page)}&limit=30&query=${
          searchQuery as string
        }`,
      );
      if (response.status === 200) {
        res.status(200).json(response.data);
      } else {
        res.status(response.status).json({
          status: response.status,
          message: response.data
            ? response.data.message[0]
            : 'Произошла ошибка при выполнении запроса к API',
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new KinopoiskController();
