import styles from './Movies.module.scss';
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import SearhForm from '../../components/SearchForm/SearchForm';
import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';
import Preloader from '../../components/Preloader/Preloader';
import Api from '../../utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
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
import { IMovie } from '../../utils/interfaces';

function Movies() {
  const likedMovies = useSelector((state: RootState) => state.likedMovies);
  const storedMovies = sessionStorage.getItem('displayedMovies');
  const parsedMovies = storedMovies ? JSON.parse(storedMovies) : [];
  const [displayedMovies, setDisplayedMovies] = useState<IMovie[]>(parsedMovies);
  const [searchQuery, setSearchQuery] = useState(sessionStorage.getItem('searchQuery') || '');
  const [moviePage, setMoviePage] = useState(Number(sessionStorage.getItem('page')) || 0);
  const [pageCondition, setPageCondition] = useState(
    Number(sessionStorage.getItem('pageCondition')) || 0,
  );
  const [visibleCardsCount, setVisibleCardsCount] = useState(12);
  const [totalMoviesCount, setTotalMoviesCount] = useState(parsedMovies.length);
  const [moviesPerLoad, setMoviesPerLoad] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('displayedMovies', JSON.stringify(displayedMovies));
  }, [displayedMovies]);

  useEffect(() => {
    // console.log(`page: ${moviePage}`);
    sessionStorage.setItem('page', JSON.stringify(moviePage));
  }, [moviePage]);

  useEffect(() => {
    // console.log(`pageCondition: ${pageCondition}`);
    sessionStorage.setItem('pageCondition', pageCondition.toString());
  }, [pageCondition]);

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

  function handleSearchSubmit(page = moviePage, direction?: boolean) {
    if (searchQuery !== '') {
      setIsLoading(true);
      setError(null);
      Api.getMovies(searchQuery, page, direction)
        .then(({ movies, page, pages }) => {
          // console.log(`pages: ${pages}`);
          // console.log(movies);
          setDisplayedMovies(movies);
          setMoviePage(page);
          setTotalMoviesCount(movies.length);
          handleResize();
          if ((page === 1 && page === pages) || pages === 0) {
            setPageCondition(0);
          } else if (page === 1) {
            setPageCondition(1);
          } else if (page !== 1 && page !== pages) {
            setPageCondition(2);
          } else if (page !== 1 && page === pages) {
            setPageCondition(3);
          }
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        })
        .finally(() => {
          sessionStorage.setItem('searchQuery', searchQuery);
          setIsLoading(false);
          setIsFormSubmitted(true);
        });
    }
  }

  function handleChangePage(direction: string) {
    if (direction === 'next') {
      const newPage = moviePage + 1;
      setMoviePage(newPage);
      handleSearchSubmit(newPage);
    } else if (direction === 'prev') {
      const newPage = moviePage - 1;
      setMoviePage(newPage);
      handleSearchSubmit(newPage, true);
    }
  }

  const handleLoadMoreClick = () => {
    const nextVisibleCardsCount = Math.min(visibleCardsCount + moviesPerLoad, totalMoviesCount);
    setVisibleCardsCount(nextVisibleCardsCount);
  };

  const updatedMoviesList = displayedMovies.slice(0, visibleCardsCount).map((movie) => {
    const isLiked = likedMovies.some((likedMovie) => likedMovie.movieId === movie.id);
    return {
      ...movie,
      isLiked,
    };
  });
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
          <div className={styles['movies__preloader-wrapper']}>
            <Preloader />
          </div>
        ) : error ? (
          <p className={styles.movies__text}>{error}</p>
        ) : displayedMovies.length === 0 ? (
          !isFormSubmitted ? (
            <></>
          ) : (
            <p className={styles.movies__text}>Ничего не найдено</p>
          )
        ) : (
          <section className={styles.movies__cards}>
            <ul className={styles.movies__cardlist}>
              {updatedMoviesList.map((movie) => (
                <MovieCard key={movie.id} movieData={movie} isLiked={movie.isLiked} />
              ))}
            </ul>
          </section>
        )}
        {totalMoviesCount > visibleCardsCount && !isLoading && (
          <button
            className={`${styles.movies__button} ${styles.movies__button_large} ${styles.movies__button_enabled} clickable`}
            onClick={handleLoadMoreClick}>
            Ещё
          </button>
        )}
        {totalMoviesCount <= visibleCardsCount && !isLoading && displayedMovies.length !== 0 && (
          <div className={styles['movies__button-container']}>
            <button
              className={
                pageCondition === 2 || pageCondition === 3
                  ? `${styles.movies__button} ${styles.movies__button_small} ${styles.movies__button_enabled} clickable`
                  : `${styles.movies__button} ${styles.movies__button_small}`
              }
              disabled={pageCondition === 0 || pageCondition === 1}
              onClick={() => handleChangePage('prev')}>
              Предыдущая страница
            </button>
            <button
              className={
                pageCondition === 1 || pageCondition === 2
                  ? `${styles.movies__button} ${styles.movies__button_small} ${styles.movies__button_enabled} clickable`
                  : `${styles.movies__button} ${styles.movies__button_small}`
              }
              disabled={pageCondition === 0 || pageCondition === 3}
              onClick={() => handleChangePage('next')}>
              Следующая страница
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Movies;
