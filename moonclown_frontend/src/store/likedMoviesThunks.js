import { saveMovie, deleteSavedMovie } from '../utils/Api';
import { addLikedMovie, removeLikedMovie } from './slices/likedMoviesSlice';

export const handleLikeCard = (movie, likedMovies) => async (dispatch) => {
  try {
    // Проверяем, есть ли уже лайк на этот фильм
    const likedMovieToDelete = likedMovies.find(
      (likedMovie) => likedMovie.movieId === movie.id
    );

    if (likedMovieToDelete) {
      // Если лайк уже есть, удаляем его
      await deleteSavedMovie(likedMovieToDelete._id);
      dispatch(removeLikedMovie(likedMovieToDelete._id));
    } else {
      // Иначе добавляем лайк
      const savedMovie = await saveMovie(movie);
      dispatch(addLikedMovie(savedMovie));
    }
  } catch (error) {
    console.error('Ошибка при лайке/удалении фильма:', error);
  }
};

export const handleDeleteCard = (id) => async (dispatch) => {
  try {
    await deleteSavedMovie(id);
    dispatch(removeLikedMovie(id));
  } catch (error) {
    console.error('Ошибка при удалении фильма:', error);
  }
};
