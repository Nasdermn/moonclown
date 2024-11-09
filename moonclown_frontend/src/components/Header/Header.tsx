import styles from './Header.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { memo, useState } from 'react';
import useCurrentUser from '../../stores/currentUser';

function HeaderComponent() {
  const loggedIn = useCurrentUser((state) => state.loggedIn);
  const { pathname } = useLocation();
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  function handleToggleMenu() {
    setIsHeaderMenuOpen(!isHeaderMenuOpen);
  }
  if (!loggedIn) {
    return pathname === '/' ? (
      <header className={styles.header}>
        <Link to="/" className={`${styles.header__logo} clickable`}></Link>
        <div className={styles.header__wrapper}>
          <Link to="/register/identify" className={`${styles.header__signup} clickable`}>
            Регистрация
          </Link>
          <Link to="/login" className={`${styles.header__signin} clickable`}>
            Войти
          </Link>
        </div>
      </header>
    ) : (
      <header className={`${styles.header} ${styles.header_black}`}>
        <Link to="/" className={`${styles.header__logo} clickable`}></Link>
        <h1 className={styles.header__title}>moonclown</h1>
      </header>
    );
  } else {
    return (
      <header className={styles.header}>
        <Link to="/" className={`${styles.header__logo} clickable`}></Link>
        <div className={styles.header__links}>
          <div className={`${styles.header__wrapper} ${styles.header__wrapper_films}`}>
            <Link
              to="/movies"
              className={`${styles.header__link} clickable ${
                pathname === '/movies' ? styles.header__link_active : ''
              }`}>
              Фильмы
            </Link>
            <Link
              to="/saved-movies"
              className={`${styles.header__link} clickable ${
                pathname === '/saved-movies' ? styles.header__link_active : ''
              }`}>
              Сохраненные фильмы
            </Link>
          </div>
          <Link
            to="/profile"
            className={`${styles.header__link} clickable ${styles.header__link_account} ${
              pathname === '/profile' ? styles.header__link_active : ''
            }`}>
            Аккаунт
          </Link>
        </div>
        <button
          className={`${styles.header__button} clickable`}
          onClick={handleToggleMenu}></button>
        <div
          className={`${styles.header__menu} ${
            isHeaderMenuOpen ? styles.header__menu_opened : ''
          }`}>
          <div className={styles.header__menu_container}>
            <div className={styles.header__menu_top}>
              <button
                className={`${styles.header__menu_closer} clickable`}
                onClick={handleToggleMenu}></button>
              <div className={styles.header__menu_links}>
                <Link
                  to="/"
                  className={`${styles.header__menu_link} clickable ${
                    pathname === '/' ? styles.header__menu_link_active : ''
                  }`}>
                  Главная
                </Link>
                <Link
                  to="/movies"
                  className={`${styles.header__menu_link} clickable ${
                    pathname === '/movies' ? styles.header__menu_link_active : ''
                  }`}>
                  Фильмы
                </Link>
                <Link
                  to="/saved-movies"
                  className={`${styles.header__menu_link} clickable ${
                    pathname === '/saved-movies' ? styles.header__menu_link_active : ''
                  }`}>
                  Сохранённые фильмы
                </Link>
              </div>
            </div>
            <Link to="/profile" className={`${styles.header__menu_account}  clickable`}>
              Аккаунт
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

const Header = memo(HeaderComponent);

export default Header;
