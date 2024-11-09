import styles from './NotFound.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pigSound from '../../assets/audio/pigSound.mp3';
import roarSound from '../../assets/audio/roarSound.mp3';
import dieSound from '../../assets/audio/dieSound.mp3';
import useCurrentUser from '../../stores/currentUser';

function NotFound() {
  const setUserInfo = useCurrentUser((state) => state.setUserInfo);
  const setLoggedIn = useCurrentUser((state) => state.setLoggedIn);
  const navigate = useNavigate();
  const [clickCounter, setClickCounter] = useState(0);
  const [pigCondition, setPigCondition] = useState(0);
  const playSound = (sound: string) => {
    const music = new Audio(sound);
    music.play();
  };

  const handleButtonClick = () => {
    setClickCounter(clickCounter + 1);
    if (clickCounter < 18) {
      playSound(pigSound);
    } else {
      setPigCondition(1);
      playSound(roarSound);
      setTimeout(() => {
        setPigCondition(2);
        playSound(dieSound);
        setTimeout(() => {
          localStorage.clear();
          setUserInfo({ name: '', email: '' });
          setLoggedIn(false);
          navigate('/login', {
            state: {
              loginText: [
                'Вы были наказаны',
                'За ваше надоедливое поведение наш местный свин был вынужден принять меры =)',
              ],
            },
          });
        }, 5000);
      }, 2000);
    }
  };

  return (
    <div className="body">
      <main className={styles.error}>
        {pigCondition === 2 ? (
          <div className={styles.error__image}></div>
        ) : pigCondition === 1 ? (
          <div className={`${styles.error__image} ${styles.error__image_active}`}></div>
        ) : (
          <div className={styles.error__container}>
            <h1 className={styles.error__title}>404</h1>
            <h2 className={styles.error__subtitle}>Страница не найдена</h2>
            <button className={styles.error__pig} onClick={handleButtonClick} type="button">
              {clickCounter > 7 ? (
                <div className={styles.error__wordcloud}>
                  <span className={styles.error__text}>Хватит, пожалуйста</span>
                </div>
              ) : null}
            </button>
            <button
              className={`${styles.error__link} clickable`}
              onClick={() => {
                navigate('/');
              }}
              type="button">
              {'-> Вернуться назад <-'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default NotFound;
