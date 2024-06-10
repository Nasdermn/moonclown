import Api from '../../utils/api';
import { addLikedMovie, removeLikedMovie } from '../slices/likedMoviesSlice';
import { ILikedMovie, IMovie } from '../../utils/interfaces';
import { Dispatch } from '@reduxjs/toolkit';

export const handleLikeCard =
  (movie: IMovie, likedMovies: ILikedMovie[]) => async (dispatch: Dispatch) => {
    try {
      const likedMovieToDelete = likedMovies.find((likedMovie) => likedMovie.movieId === movie.id);

      if (likedMovieToDelete) {
        await Api.deleteSavedMovie(likedMovieToDelete._id);
        dispatch(removeLikedMovie(likedMovieToDelete._id));
      } else {
        const savedMovie = await Api.saveMovie(movie);
        dispatch(addLikedMovie(savedMovie));
      }
    } catch (error) {
      console.error('Ошибка при лайке/удалении фильма:', error);
    }
  };

export const handleDeleteCard = (id: number) => async (dispatch: Dispatch) => {
  try {
    await Api.deleteSavedMovie(id);
    dispatch(removeLikedMovie(id));
  } catch (error) {
    console.error('Ошибка при удалении фильма:', error);
  }
};
