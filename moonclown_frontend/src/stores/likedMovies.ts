import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Api from '../utils/api';
import { ILikedMoviesState, IMovie } from '../utils/interfaces';

const useLikedMovies = create(
  devtools<ILikedMoviesState>(
    (set, get) => ({
      likedMovies: [],
      setLikedMovies: (movies) => set({ likedMovies: movies }, false, 'setLikedMovies'),

      handleLikeCard: async (movie: IMovie) => {
        const { likedMovies } = get();

        try {
          const likedMovieToDelete = likedMovies.find(
            (likedMovie) => likedMovie.movieId === movie.id
          );

          if (likedMovieToDelete) {
            await Api.deleteSavedMovie(likedMovieToDelete._id);
            set(
              {
                likedMovies: likedMovies.filter(
                  (likedMovie) => likedMovie._id !== likedMovieToDelete._id
                ),
              },
              false,
              'dislikeMovie'
            );
          } else {
            const savedMovie = await Api.saveMovie(movie);
            set({ likedMovies: [...likedMovies, savedMovie] }, false, 'likeMovie');
          }
        } catch (error) {
          console.error('Ошибка при лайке/удалении фильма:', error);
        }
      },

      handleDeleteCard: async (id: number) => {
        const { likedMovies } = get();

        try {
          await Api.deleteSavedMovie(id);
          set(
            { likedMovies: likedMovies.filter((movie) => movie._id !== id) },
            false,
            'deleteMovie'
          );
        } catch (error) {
          console.error('Ошибка при удалении фильма:', error);
        }
      },
    }),
    { name: 'likedMovies' }
  )
);

export default useLikedMovies;
