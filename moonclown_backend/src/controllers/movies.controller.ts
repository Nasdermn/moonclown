import { Request, Response, NextFunction } from 'express';
import moviesService from '../services/movies.service';
import { IMovie } from '../utils/interfaces/movies.interface';

class MoviesController {
  async getMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = (req as any).user._id;
      const movies = await moviesService.getMovies(owner);
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  }

  async createMovie(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = (req as any).user._id;
      const movie: IMovie = req.body;
      const result = await moviesService.createMovie(movie, owner);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeMovie(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = (req as any).user._id;
      const movieId = req.params.id;
      await moviesService.removeMovie(owner, movieId);
      res.status(200).json({ message: 'Карточка с фильмом удалена.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new MoviesController();
