import styles from './MoviePoster.module.scss';
import { memo } from 'react';
import { IMoviePosterProps } from '../../utils/interfaces';
import { Timeconverter } from '../../utils/timeConvertFunction.ts';

const MoviePosterComponent: React.FC<IMoviePosterProps> = ({ movieData, isOpen, onClose }) => {
  return (
    <div className={`absolute-wrapper ${isOpen ? 'absolute-wrapper_opened' : ''}`}>
      <div className={styles.poster}>
        <button className={`${styles.poster__cross} clickable`} type='button' onClick={onClose} />
        <img className={styles.poster__photo} src={movieData.poster} />
        <h2 className={styles.poster__title}>{movieData.name}</h2>
        <div className={styles.poster__wrapper}>
          <div className={`${styles.poster__info} ${styles.poster__info_genres}`}>
            <h3 className={styles.poster__subtitle}>Жанры:</h3>
            <ul className={styles.poster__genres}>
              {movieData.genres.map((genre, index) => (
                <li key={index} className={styles.poster__genre}>
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.poster__info} ${styles.poster__info_major}`}>
            <p className={styles.poster__note}>
              Тип: <span className={styles.poster__value}>{movieData.type}</span>
            </p>
            <p className={styles.poster__note}>
              Длительность:{' '}
              <span className={styles.poster__value}>{Timeconverter(movieData.movieLength)}</span>
            </p>
            <p className={styles.poster__note}>
              Год: <span className={styles.poster__value}>{movieData.year}</span>
            </p>
            <p className={styles.poster__note}>
              Страна: <span className={styles.poster__value}>{movieData.country}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const isPosterOpen = (prevProps: IMoviePosterProps, nextProps: IMoviePosterProps) => {
  return prevProps.isOpen === nextProps.isOpen;
};

const MoviePoster = memo(MoviePosterComponent, isPosterOpen);

export default MoviePoster;
