import styles from './Header.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Header() {
  const loggedIn = useSelector((state) => state.currentUser.loggedIn);
  const { pathname } = useLocation();
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  function handleToggleMenu() {
    setIsHeaderMenuOpen(!isHeaderMenuOpen);
  }
  if (!loggedIn) {
    return pathname === '/' ? (
      <header className={styles.header}>
        <Link to='/' className={styles.header__logo}></Link>
        <div className={styles.header__wrapper}>
          <Link to='/signup' className={styles.header__signup}>
            Регистрация
          </Link>
          <Link to='/signin' className={styles.header__signin}>
            Войти
          </Link>
        </div>
      </header>
    ) : (
      <header className={`${styles.header} ${styles.header_black}`}>
        <Link to='/' className={styles.header__logo}></Link>
        <h1 className={styles.header__title}>moonclown</h1>
      </header>
    );
  } else {
    return (
      <header className={styles.header}>
        <Link to='/' className={styles.header__logo}></Link>
        <div className={styles.header__links}>
          <div
            className={`${styles.header__wrapper} ${styles.header__wrapper_films}`}
          >
            <Link
              to='/movies'
              className={`${styles.header__link} ${
                pathname === '/movies' ? styles.header__link_active : ''
              }`}
            >
              Фильмы
            </Link>
            <Link
              to='/saved-movies'
              className={`${styles.header__link} ${
                pathname === '/saved-movies' ? styles.header__link_active : ''
              }`}
            >
              Сохраненные фильмы
            </Link>
          </div>
          <Link
            to='/profile'
            className={`${styles.header__link} ${styles.header__link_account}`}
          >
            Аккаунт
          </Link>
        </div>
        <button
          className={styles.header__button}
          onClick={handleToggleMenu}
        ></button>
        <div
          className={`${styles.header__menu} ${
            isHeaderMenuOpen ? styles.header__menu_opened : ''
          }`}
        >
          <div className={styles.header__menu_container}>
            <div className={styles.header__menu_top}>
              <button
                className={styles.header__menu_closer}
                onClick={handleToggleMenu}
              ></button>
              <div className={styles.header__menu_links}>
                <Link
                  to='/'
                  className={`${styles.header__menu_link} ${
                    pathname === '/' ? styles.header__menu_link_active : ''
                  }`}
                >
                  Главная
                </Link>
                <Link
                  to='/movies'
                  className={`${styles.header__menu_link} ${
                    pathname === '/movies'
                      ? styles.header__menu_link_active
                      : ''
                  }`}
                >
                  Фильмы
                </Link>
                <Link
                  to='/saved-movies'
                  className={`${styles.header__menu_link} ${
                    pathname === '/saved-movies'
                      ? styles.header__menu_link_active
                      : ''
                  }`}
                >
                  Сохранённые фильмы
                </Link>
              </div>
            </div>
            <Link to='/profile' className={styles.header__menu_account}>
              Аккаунт
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
