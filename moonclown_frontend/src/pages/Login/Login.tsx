import styles from '../Register/Register.module.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLoggedIn, setUserInfo } from '../../store/slices/currentUserSlice';
import Header from '../../components/Header/Header';
import { useFormValidation } from '../../utils/validation';
import Api from '../../utils/api';
import { showError } from '../../utils/showError';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginText = location.state?.loginText || false;
  const { values, handleChange, errors, isValid } = useFormValidation({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const [isButtonBlocked, setIsButtonBlocked] = useState(false);
  const [isInputsDisabled, setIsInputsDisabled] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  function handleUserAuthorization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isValid) {
      Api.signin(values.email, values.password)
        .then((res) => {
          if (res) {
            dispatch(setLoggedIn(true));
            dispatch(setUserInfo({ name: res.name, email: res.email }));
            navigate('/profile', { replace: true });
          }
        })
        .catch((err) => {
          showError(
            err.response.data.message,
            3000,
            setError,
            setIsButtonBlocked,
            setIsInputsDisabled,
          );
        });
    }
  }

  return (
    <div className='body'>
      <div className='auth-wrapper'>
        <Header />
        <main className={`${styles.authorization} ${styles.authorization_green}`}>
          <h1 className={styles.authorization__title}>
            {loginText ? `${loginText[0]}` : 'Рады видеть!'}
          </h1>
          <form
            className={styles.authorization__form}
            onSubmit={handleUserAuthorization}
            noValidate>
            <label className={styles.authorization__label}>
              <span className={styles['authorization__input-title']}>E-mail</span>
              <input
                className={styles.authorization__input}
                minLength={7}
                maxLength={60}
                name='email'
                type='email'
                id='login-input-email'
                required
                placeholder='Введите email'
                value={values.email || ''}
                onChange={handleChange}
                disabled={isInputsDisabled}
              />
              {errors.email && <span className='error'>{errors.email}</span>}
            </label>
            <label className={styles.authorization__label}>
              <span className={styles['authorization__input-title']}>Пароль</span>
              <div className='password-wrapper'>
                <input
                  className={styles.authorization__input}
                  name='password'
                  type={isPasswordShown ? 'input' : 'password'}
                  id='login-input-password'
                  required
                  minLength={8}
                  maxLength={24}
                  placeholder='Введите пароль'
                  value={values.password || ''}
                  onChange={handleChange}
                  disabled={isInputsDisabled}
                />
                {!isInputsDisabled && (
                  <button
                    type='button'
                    className={
                      isPasswordShown ? 'password-switch password-switch_active' : 'password-switch'
                    }
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              {errors.password && <span className='error'>{errors.password}</span>}
            </label>
            <button
              className={`${styles.authorization__button} ${
                !isValid || isButtonBlocked ? styles.authorization__button_disabled : 'clickable'
              }`}
              type='submit'
              disabled={!isValid || isButtonBlocked}>
              Войти
            </button>
            <p className={styles.authorization__text}>
              Не зарегистрированы? &nbsp;
              <Link to='/signup' className={`${styles.authorization__link} clickable`}>
                {'-> Регистрация <-'}
              </Link>
            </p>
            <Link
              to='/forgot-password'
              className={`${styles.authorization__link} ${styles.authorization__link_separate} clickable`}>
              Забыли пароль?
            </Link>
            {error && <span className='error error_centered'>{error}</span>}
            {loginText && <p className={styles.authorization__msg}> {loginText[1]}</p>}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;
