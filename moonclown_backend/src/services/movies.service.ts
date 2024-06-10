import movieModel from '../models/movie.model';
import NotFoundError from '../utils/errors/NotFoundError';
import BadRequestError from '../utils/errors/BadRequestError';
import ForbiddenError from '../utils/errors/ForbiddenError';
import { IMovie } from '../utils/interfaces/movies.interface';

class MoviesService {
  async getMovies(owner: string) {
    try {
      const movies = await movieModel.find({ owner });
      return movies;
    } catch (error: any) {
      throw error;
    }
  }

  async createMovie(movie: IMovie, owner: string) {
    try {
      const result = await movieModel.create({
        name: movie.name,
        type: movie.type,
        year: movie.year,
        genres: movie.genres,
        country: movie.country,
        movieLength: movie.movieLength,
        poster: movie.poster,
        owner,
        movieId: movie.id,
      });
      return result;
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw new BadRequestError(
          'Указаны некорректные данные при создании фильма',
        );
      }
      throw error;
    }
  }

  async removeMovie(owner: string, movieId: string) {
    try {
      const movie = await movieModel.findById(movieId);
      if (!movie) {
        throw new NotFoundError('По указанному id фильм не найден');
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError(
          'У вас нет прав для удаления чужой карточки с фильмом',
        );
      }
      await movieModel.findByIdAndDelete(movieId);
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для удаления карточки с фильмом',
        );
      }
      throw error;
    }
  }
}

export default new MoviesService();
