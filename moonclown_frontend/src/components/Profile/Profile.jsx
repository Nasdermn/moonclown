import styles from './Profile.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../Header/Header.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoggedIn,
  setUserInfo,
} from '../../store/slices/currentUserSlice.js';
import NamePopup from '../NamePopup/NamePopup.jsx';
import AvatarPopup from '../AvatarPopup/AvatarPopup.jsx';
import PasswordPopup from '../PasswordPopup/PasswordPopup.jsx';

function Profile() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.currentUser.userInfo);
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);

  function handleUserLogout() {
    localStorage.clear();
    dispatch(setUserInfo({ name: '', email: '' }));
    dispatch(setLoggedIn(false));
  }

  function closeAllPopups() {
    setIsNamePopupOpen(false);
    setIsAvatarPopupOpen(false);
    setIsPasswordPopupOpen(false);
  }

  return (
    <div className='body'>
      <Header />
      <main className={styles.profile}>
        <div className={styles.profile__data}>
          <h1 className={styles.profile__title}>Ваш профиль</h1>
          <div className={styles.profile__infoblock}>
            <img
              className={styles.profile__avatar}
              src={userInfo.avatar}
              alt='Фотография профиля'
            ></img>
            <div className={styles.profile__info}>
              <p className={styles.profile__property}>Никнейм:</p>
              <p className={`${styles.profile__value}`}>{userInfo.name}</p>
              <p className={styles.profile__property}>Почта:</p>
              <p className={`${styles.profile__value}`}>{userInfo.email}</p>
            </div>
          </div>
        </div>
        <div className={styles.profile__editor}>
          <button
            className={styles.profile__button}
            type='button'
            disabled={isNamePopupOpen}
            onClick={() => setIsNamePopupOpen(true)}
          >
            Изменить имя
          </button>
          <button
            className={styles.profile__button}
            type='button'
            disabled={isAvatarPopupOpen}
            onClick={() => setIsAvatarPopupOpen(true)}
          >
            Изменить аватарку
          </button>
          <button
            className={styles.profile__button}
            type='button'
            disabled={isPasswordPopupOpen}
            onClick={() => setIsPasswordPopupOpen(true)}
          >
            Изменить пароль
          </button>
          <Link to='/' className={styles.profile__link}>
            <button
              className={`${styles.profile__button} ${styles.profile__button_red}`}
              type='button'
              onClick={handleUserLogout}
            >
              Выйти из аккаунта
            </button>
          </Link>
        </div>
      </main>
      <NamePopup isOpen={isNamePopupOpen} onClose={closeAllPopups}></NamePopup>
      <AvatarPopup
        isOpen={isAvatarPopupOpen}
        onClose={closeAllPopups}
      ></AvatarPopup>
      <PasswordPopup
        isOpen={isPasswordPopupOpen}
        onClose={closeAllPopups}
      ></PasswordPopup>
    </div>
  );
}

export default Profile;
