import styles from './NotFound.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pig from '../../audio/pig.mp3';
import bunny from '../../audio/bunny.mp3';
import rabbit from '../../audio/rabbit.mp3';
import { useDispatch } from 'react-redux';
import {
  setUserInfo,
  setLoggedIn,
} from '../../store/slices/currentUserSlice.js';

function NotFound() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clickCounter, setClickCounter] = useState(0);
  const [pigCondition, setPigCondition] = useState(false);
  const playSound = (sound) => {
    const music = new Audio(sound);
    music.play();
  };

  const handleButtonClick = () => {
    setClickCounter(clickCounter + 1);
    if (clickCounter < 18) {
      playSound(pig);
    } else {
      setPigCondition(1);
      playSound(bunny);
      setTimeout(() => {
        setPigCondition(2);
        playSound(rabbit);
        setTimeout(() => {
          localStorage.clear();
          dispatch(setUserInfo({ name: '', email: '' }));
          dispatch(setLoggedIn(false));
          navigate('/signin');
        }, 5000);
      }, 2000);
    }
  };

  return (
    <div className='body'>
      {pigCondition === 2 ? (
        <div
          className={`${styles.error__bunny} ${styles.error__bunny_active}`}
        ></div>
      ) : pigCondition === 1 ? (
        <div className={styles.error__bunny}></div>
      ) : (
        <main className={styles.error}>
          <div className={styles.error__container}>
            <h1 className={styles.error__title}>404</h1>
            <h2 className={styles.error__subtitle}>Страница не найдена</h2>
            <button
              className={styles.error__pig}
              onClick={handleButtonClick}
              type='button'
            >
              {clickCounter > 7 ? (
                <div className={styles.error__wordcloud}>
                  <span className={styles.error__text}>Хватит, пожалуйста</span>
                </div>
              ) : null}
            </button>
            <button
              className={styles.error__link}
              onClick={() => {
                navigate('/');
              }}
              type='button'
            >
              {'-> Вернуться назад <-'}
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default NotFound;
