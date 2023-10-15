import styles from './MoviesCardList.module.scss';
import MoviesCard from '../MoviesCard/MoviesCard.jsx';
import { useSelector } from 'react-redux';

function MoviesCardList({ moviesList }) {
  const likedMovies = useSelector((state) => state.likedMovies);
  const updatedMoviesList = moviesList.map((movie) => {
    const isLiked = likedMovies.some(
      (likedMovie) => likedMovie.movieId === movie.id
    );
    return {
      ...movie,
      isLiked,
    };
  });
  return (
    <section className={styles.movies__cards}>
      <ul className={styles.movies__cardlist}>
        {updatedMoviesList.map((movie) => (
          <MoviesCard
            key={movie.movieId || movie.id}
            movieData={movie}
            isLiked={movie.isLiked}
          />
        ))}
      </ul>
    </section>
  );
}

export default MoviesCardList;
