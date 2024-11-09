import styles from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import Header from '../../components/Header/Header';
import useCurrentUser from '../../stores/currentUser';
import NamePopup from '../../components/NamePopup/NamePopup';
import AvatarPopup from '../../components/AvatarPopup/AvatarPopup';
import PasswordPopup from '../../components/PasswordPopup/PasswordPopup';
import { MAIN_API_URL } from '../../utils/constants';

function Profile() {
  const userInfo = useCurrentUser((state) => state.userInfo);
  const setUserInfo = useCurrentUser((state) => state.setUserInfo);
  const setLoggedIn = useCurrentUser((state) => state.setLoggedIn);
  const navigate = useNavigate();
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);

  function handleUserLogout() {
    navigate('/');
    localStorage.clear();
    setUserInfo({ name: '', email: '' });
    setLoggedIn(false);
  }

  const closeAllPopups = useCallback(() => {
    setIsNamePopupOpen(false);
    setIsAvatarPopupOpen(false);
    setIsPasswordPopupOpen(false);
  }, []);

  return (
    <div className="body">
      <Header />
      <main className={styles.profile}>
        <h1 className={styles.profile__title}>Ваш профиль</h1>
        <div className={styles.profile__data}>
          <img
            className={styles.profile__avatar}
            src={`${MAIN_API_URL}/images/${userInfo.avatar}`}
            alt="Фотография профиля"></img>
          <div className={styles.profile__info}>
            <p className={styles.profile__property}>Никнейм:</p>
            <p className={`${styles.profile__value}`}>{userInfo.name}</p>
            <p className={styles.profile__property}>Почта:</p>
            <p className={`${styles.profile__value}`}>{userInfo.email}</p>
          </div>
        </div>
        <div className={styles.profile__panel}>
          <button
            className={`${styles.profile__button} clickable `}
            type="button"
            disabled={isNamePopupOpen}
            onClick={() => setIsNamePopupOpen(true)}>
            Изменить имя
          </button>
          <button
            className={`${styles.profile__button} clickable `}
            type="button"
            disabled={isAvatarPopupOpen}
            onClick={() => setIsAvatarPopupOpen(true)}>
            Изменить аватарку
          </button>
          <button
            className={`${styles.profile__button} clickable `}
            type="button"
            disabled={isPasswordPopupOpen}
            onClick={() => setIsPasswordPopupOpen(true)}>
            Изменить пароль
          </button>
          <button
            className={`${styles.profile__button} ${styles.profile__button_red} clickable `}
            type="button"
            onClick={handleUserLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </main>
      <NamePopup isOpen={isNamePopupOpen} onClose={closeAllPopups}></NamePopup>
      <AvatarPopup isOpen={isAvatarPopupOpen} onClose={closeAllPopups}></AvatarPopup>
      <PasswordPopup isOpen={isPasswordPopupOpen} onClose={closeAllPopups}></PasswordPopup>
    </div>
  );
}

export default Profile;
