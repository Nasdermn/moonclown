import styles from './MovieCard.module.scss';
import { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Timeconverter } from '../../utils/timeConvertFunction.ts';
import { useDispatch, useSelector } from 'react-redux';
import { handleLikeCard, handleDeleteCard } from '../../store/thunks/likedMoviesThunks.ts';
import { RootState } from '../../store/store.ts';
import { ThunkDispatch, Action } from '@reduxjs/toolkit';
import { IMovieCardProps } from '../../utils/interfaces.ts';
import MoviePoster from '../MoviePoster/MoviePoster.tsx';

const MovieCardComponent: React.FC<IMovieCardProps> = ({ movieData, isLiked }) => {
  const { pathname } = useLocation();
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const dispatch: ThunkDispatch<RootState, unknown, Action> = useDispatch();
  const likedMovies = useSelector((state: RootState) => state.likedMovies);

  const handleLikeClick = () => {
    if ('id' in movieData) {
      dispatch(handleLikeCard(movieData, likedMovies));
    } else {
      console.error('Ошибка типа данных: ожидался id');
    }
  };

  const handleCrossClick = () => {
    if ('_id' in movieData) {
      dispatch(handleDeleteCard(movieData._id));
    } else {
      console.error('Ошибка типа данных: ожидался _id');
    }
  };

  return (
    <li className={styles.card}>
      <img
        src={movieData.poster}
        alt='Фото фильма'
        className={styles.card__image}
        onClick={() => setIsPosterOpen(true)}></img>
      <div className={styles.card__wrapper}>
        <h2 className={styles.card__title}>{movieData.name}</h2>
        {pathname === '/movies' ? (
          <button
            className={`${styles.card__button} ${styles.card__like} clickable ${
              isLiked ? styles.card__like_active : ''
            }`}
            onClick={handleLikeClick}
          />
        ) : (
          <button
            className={`${styles.card__button} ${styles.card__cross} clickable`}
            onClick={handleCrossClick}
          />
        )}
        <span className={styles.card__year}>{movieData.year}</span>
        <span className={styles.card__duration}>{Timeconverter(movieData.movieLength)}</span>
      </div>
      <MoviePoster
        movieData={movieData}
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}></MoviePoster>
    </li>
  );
};

const isCardLiked = (prevProps: IMovieCardProps, nextProps: IMovieCardProps) => {
  return prevProps.isLiked === nextProps.isLiked;
};

const MovieCard = memo(MovieCardComponent, isCardLiked);

export default MovieCard;
