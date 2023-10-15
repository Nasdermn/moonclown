import styles from './MoviesCard.module.scss';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../utils/constants.js';
import { Timeconverter } from '../../utils/Timeconverter.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleLikeCard,
  handleDeleteCard,
} from '../../store/likedMoviesThunks';

function MoviesCard({ movieData, isLiked }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const likedMovies = useSelector((state) => state.likedMovies);

  const handleLikeClick = () => {
    // onLike(movieData);
    dispatch(handleLikeCard(movieData, likedMovies));
  };

  const handleCrossClick = () => {
    // onDelete(movieData._id);
    dispatch(handleDeleteCard(movieData._id));
  };

  return (
    <li className={styles.card}>
      <a
        className={styles.card__link}
        href={movieData.trailerLink}
        rel='noopener noreferrer'
        target='_blank'
      >
        <img
          src={
            pathname === '/saved-movies'
              ? movieData.image
              : `${API_URL}${movieData.image.url}`
          }
          alt='Фото фильма'
          className={styles.card__image}
        ></img>
      </a>
      <div className={styles.card__wrapper}>
        <h2 className={styles.card__title}>{movieData.nameRU}</h2>
        {pathname === '/movies' ? (
          <button
            className={`${styles.card__like} ${
              isLiked ? styles.card__like_active : ''
            }`}
            onClick={handleLikeClick}
          />
        ) : (
          <button className={styles.card__cross} onClick={handleCrossClick} />
        )}
      </div>
      <p className={styles.card__duration}>
        {Timeconverter(movieData.duration)}
      </p>
    </li>
  );
}

export default MoviesCard;
