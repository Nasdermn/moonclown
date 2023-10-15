import styles from './Login.module.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setLoggedIn,
  setUserInfo,
} from '../../store/slices/currentUserSlice.js';
import Header from '../Header/Header.jsx';
import { useFormWithValidation } from '../Validation/Validation.js';
import { signin, getUser } from '../../utils/Api.js';
import { showNotification } from '../../utils/showNotification.js';

function Login() {
  const navigate = useNavigate();
  const { values, handleChange, errors, isValid, setIsValid } =
    useFormWithValidation();
  const dispatch = useDispatch();
  const [isButtonBlocked, setIsButtonBlocked] = useState(false);
  const [isInputsDisabled, setIsInputsDisabled] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success', // 'success' или 'error'
  });

  function handleUserAuthorization(event) {
    event.preventDefault();

    if (isValid) {
      signin(values.email, values.password)
        .then((data) => {
          if (data.token) {
            localStorage.setItem('jwt', data.token);
            getUser(data.token).then((res) => {
              if (res) {
                dispatch(setLoggedIn(true));
                dispatch(setUserInfo({ name: res.name, email: res.email }));
                navigate('/profile', { replace: true });
              }
            });
          }
        })
        .catch((err) => {
          err.response.status === 400
            ? showNotification(
                'Пожалуйста, введите настоящий адрес электронной почты.',
                'error',
                5000,
                setNotification,
                setIsButtonBlocked
              )
            : showNotification(
                err.response.data.message,
                'error',
                5000,
                setNotification,
                setIsButtonBlocked
              );
          setIsInputsDisabled(true);
          setTimeout(() => {
            setIsInputsDisabled(false);
            setIsValid(false);
          }, 5000);
        });
    }
  }

  return (
    <div className='body'>
      <div className='wrapper'>
        <Header />
        <main className={styles.login}>
          <h1 className={styles.login__title}>Здравствуй, мой друг 😜</h1>
          <form
            className={styles.login__form}
            onSubmit={handleUserAuthorization}
            noValidate
          >
            <label className={styles.login__label}>
              <span className={styles.login__input_title}>E-mail</span>
              <input
                className={styles.login__input}
                name='email'
                type='email'
                id='login-input-email'
                required
                placeholder='Введите email'
                value={values.email || ''}
                onChange={handleChange}
                disabled={isInputsDisabled}
              />
              {errors.email && (
                <span className={styles.login__input_error}>
                  {errors.email}
                </span>
              )}
            </label>
            <label className={styles.login__label}>
              <span className={styles.login__input_title}>Пароль</span>
              <input
                className={styles.login__input}
                name='password'
                type='password'
                id='login-input-password'
                required
                minLength={8}
                maxLength={24}
                placeholder='Введите пароль'
                value={values.password || ''}
                onChange={handleChange}
                disabled={isInputsDisabled}
              />
              {errors.password && (
                <span className={styles.login__input_error}>
                  {errors.password}
                </span>
              )}
            </label>
            <button
              className={`${styles.login__button} ${
                !isValid || isButtonBlocked ? '' : styles.login__button_enabled
              }`}
              type='submit'
              disabled={!isValid || isButtonBlocked}
            >
              Войти
            </button>
            <p className={styles.login__text}>
              Ещё не зарегистрированы? &nbsp;
              <Link to='/signup' className={styles.login__link}>
                Регистрация
              </Link>
            </p>
            {notification.message && (
              <span
                className={`${styles.login__input_error} ${styles.login__input_error_centered}`}
              >
                {notification.message}
              </span>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;
