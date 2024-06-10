import styles from '../Movies/Movies.module.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import Header from '../../components/Header/Header';
import SearhForm from '../../components/SearchForm/SearchForm';
import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';
import Preloader from '../../components/Preloader/Preloader';
import {
  BIG_MONITOR_SCREEN_WIDTH,
  MONITOR_SCREEN_WIDTH,
  SMALL_MONITOR_SCREEN_WIDTH,
  TABLET_SCREEN_WIDTH,
  BIG_MONITOR_CARDS_AMOUNT,
  MONITOR_CARDS_AMOUNT,
  SMALL_MONITOR_CARDS_AMOUNT,
  TABLET_CARDS_AMOUNT,
  MOBILE_CARDS_AMOUNT,
  BIG_MONITOR_CARDS_PER_LOAD,
  MONITOR_CARDS_PER_LOAD,
  SMALL_MONITOR_CARDS_PER_LOAD,
  TABLET_CARDS_PER_LOAD,
  MOBILE_CARDS_PER_LOAD,
} from '../../utils/constants';
import { ILikedMovie } from '../../utils/interfaces';

function SavedMovies() {
  const likedMovies = useSelector((state: RootState) => state.likedMovies);
  const [displayedMovies, setDisplayedMovies] = useState<ILikedMovie[]>(likedMovies);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCardsCount, setVisibleCardsCount] = useState(12);
  const [totalMoviesCount, setTotalMoviesCount] = useState(displayedMovies.length);
  const [moviesPerLoad, setMoviesPerLoad] = useState(3);

  useEffect(() => {
    setDisplayedMovies(likedMovies);
  }, [likedMovies]);

  function handleSearchSubmit() {
    if (likedMovies.length !== 0) {
      setIsLoading(true);
      setError(null);
      const filteredMovies = likedMovies.filter((movie) =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setDisplayedMovies(filteredMovies);
      setTotalMoviesCount(filteredMovies.length);
      handleResize();
      setIsLoading(false);
    }
  }

  function resetSearch() {
    setSearchQuery('');
    setDisplayedMovies(likedMovies);
    setTotalMoviesCount(likedMovies.length);
    handleResize();
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleResize() {
    const width = window.innerWidth;
    if (width >= BIG_MONITOR_SCREEN_WIDTH) {
      setVisibleCardsCount(BIG_MONITOR_CARDS_AMOUNT);
      setMoviesPerLoad(BIG_MONITOR_CARDS_PER_LOAD);
    } else if (width >= MONITOR_SCREEN_WIDTH) {
      setVisibleCardsCount(MONITOR_CARDS_AMOUNT);
      setMoviesPerLoad(MONITOR_CARDS_PER_LOAD);
    } else if (width >= SMALL_MONITOR_SCREEN_WIDTH) {
      setVisibleCardsCount(SMALL_MONITOR_CARDS_AMOUNT);
      setMoviesPerLoad(SMALL_MONITOR_CARDS_PER_LOAD);
    } else if (width >= TABLET_SCREEN_WIDTH) {
      setVisibleCardsCount(TABLET_CARDS_AMOUNT);
      setMoviesPerLoad(TABLET_CARDS_PER_LOAD);
    } else {
      setVisibleCardsCount(MOBILE_CARDS_AMOUNT);
      setMoviesPerLoad(MOBILE_CARDS_PER_LOAD);
    }
  }

  const handleLoadMoreClick = () => {
    const nextVisibleCardsCount = Math.min(visibleCardsCount + moviesPerLoad, totalMoviesCount);
    setVisibleCardsCount(nextVisibleCardsCount);
  };

  const updatedMoviesList = displayedMovies.slice(0, visibleCardsCount);

  return (
    <div className='body'>
      <Header />
      <main className={styles.movies}>
        <SearhForm
          onSubmit={handleSearchSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {isLoading ? (
          <div className={styles['preloader-wrapper']}>
            <Preloader />
          </div>
        ) : error ? (
          <p className={styles.movies__text}>{error}</p>
        ) : displayedMovies.length === 0 ? (
          <p className={styles.movies__text}>Ничего не найдено</p>
        ) : (
          <>
            <section className={styles.movies__cards}>
              <ul className={styles.movies__cardlist}>
                {updatedMoviesList.map((movie) => (
                  <MovieCard key={movie.movieId} movieData={movie} />
                ))}
              </ul>
            </section>
            {totalMoviesCount > visibleCardsCount && !isLoading && (
              <button
                className={`${styles.movies__button} ${styles.movies__button_large} ${styles.movies__button_enabled} clickable`}
                onClick={handleLoadMoreClick}>
                Ещё
              </button>
            )}
          </>
        )}
        {displayedMovies.length === 0 && likedMovies.length !== 0 && (
          <button
            className={`${styles.movies__button} ${styles.movies__button_large} ${styles.movies__button_enabled} clickable`}
            onClick={resetSearch}>
            Назад ко всем фильмам
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SavedMovies;
