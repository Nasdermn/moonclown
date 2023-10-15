import styles from '../Movies/Movies.module.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Header from '../Header/Header.jsx';
import SearhForm from '../SearchForm/SearchForm.jsx';
import MoviesCardList from '../MoviesCardList/MoviesCardList.jsx';
import Footer from '../Footer/Footer.jsx';
import Preloader from '../Preloader/Preloader.jsx';

import { SHORTFILM_MAX_DURATION } from '../../utils/constants';

function SavedMovies() {
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortFilmChecked, setShortFilmChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const likedMovies = useSelector((state) => state.likedMovies);

  useEffect(() => {
    handleSearchSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortFilmChecked]);

  useEffect(() => {
    setDisplayedMovies(likedMovies);
  }, [likedMovies]);

  function handleSearchSubmit() {
    setIsLoading(true);
    setError(null);
    let filteredMovies = likedMovies.filter(
      (movie) =>
        movie.nameRU.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.nameEN.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (shortFilmChecked) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.duration <= SHORTFILM_MAX_DURATION
      );
    }
    setDisplayedMovies(filteredMovies);
    setIsLoading(false);
  }

  return (
    <div className='body'>
      <Header />
      <main className={styles.movies}>
        <SearhForm
          onSubmit={handleSearchSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          shortFilmChecked={shortFilmChecked}
          setShortFilmChecked={setShortFilmChecked}
        />
        {isLoading ? (
          <Preloader />
        ) : error ? (
          <p className={styles.movies__text}>{error}</p>
        ) : displayedMovies.length === 0 ? (
          <p className={styles.movies__text}>Ничего не найдено</p>
        ) : (
          <MoviesCardList moviesList={displayedMovies} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SavedMovies;
