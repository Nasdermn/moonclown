import styles from './Register.module.scss';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUserInfo } from '../../store/slices/currentUserSlice';
import Header from '../../components/Header/Header';
import { useFormValidation } from '../../utils/validation';
import Api from '../../utils/api';
import { showError } from '../../utils/showError';
import { AxiosError } from 'axios';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, handleChange, errors, isValid, setIsValid } = useFormValidation({
    name: '',
    email: '',
    password: '',
    code: '',
  });
  const [isFormEditing, setIsFormEditing] = useState(true);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [registerButtonBlocked, setRegisterButtonBlocked] = useState(false);
  const [codeButtonBlocked, setCodeButtonBlocked] = useState(false);
  const [error, setError] = useState('');
  const [isCodeRequested, setIsCodeRequested] = useState(
    localStorage.getItem('isCodeRequested') === 'true' || false,
  );
  const [nextCodeRequestTime, setNextCodeRequestTime] = useState(
    parseInt(localStorage.getItem('nextCodeRequestTime')!) || 0,
  );
  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, Math.ceil((nextCodeRequestTime - Date.now()) / 1000)),
  );
  const [isCodeExpired, setIsCodeExpired] = useState(
    localStorage.getItem('isCodeExpired') === 'true' || false,
  );

  const isFormEditingRef = useRef(isFormEditing);

  useEffect(() => {
    isFormEditingRef.current = isFormEditing;
  }, [isFormEditing]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (nextCodeRequestTime > now) {
        setIsCodeRequested(true);
        setRemainingTime(Math.ceil((nextCodeRequestTime - now) / 1000));
      } else {
        setIsCodeRequested(false);
        localStorage.removeItem('isCodeRequested');
        localStorage.removeItem('enteredEmail');
        setRemainingTime(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextCodeRequestTime]);

  useEffect(() => {
    const savedName = localStorage.getItem('enteredName');
    const savedEmail = localStorage.getItem('enteredEmail');
    const savedPassword = localStorage.getItem('enteredPassword');
    if (isCodeRequested) {
      if (savedName) values.name = savedName;
      if (savedEmail) values.email = savedEmail;
      if (savedPassword) {
        values.password = savedPassword;
        setIsValid(true);
      }
    }
  }, []);

  async function handleUserRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterButtonBlocked(true);
    if (isValid) {
      try {
        const checkCodeResponse = await Api.checkCode(values.email, values.code);
        if (checkCodeResponse.status === 200) {
          Api.signup(values.name, values.email, values.password)
            .then(() => {
              return Api.signin(values.email, values.password);
            })
            .then((res) => {
              localStorage.removeItem('isCodeRequested');
              localStorage.removeItem('enteredName');
              localStorage.removeItem('enteredEmail');
              localStorage.removeItem('enteredPassword');
              localStorage.removeItem('nextCodeRequestTime');
              localStorage.removeItem('isCodeExpired');
              if (res) {
                dispatch(setLoggedIn(true));
                dispatch(setUserInfo({ name: res.name, email: res.email }));
                navigate('/', { replace: true });
              }
            })
            .catch((err) => {
              showError(err.response.data.message, 4000, setError, setRegisterButtonBlocked);
            });
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          if (err.response.status === 410) {
            localStorage.setItem('isCodeExpired', 'true');
          }
          showError(err.response.data.message, 4000, setError, setRegisterButtonBlocked);
        }
      }
    }
  }

  async function handleGetCode(name: string, email: string, password: string) {
    await Api.sendCode(email)
      .then(() => {
        setIsFormEditing(false);
        const nextRequestTime = Date.now() + 60 * 1000;
        localStorage.setItem('nextCodeRequestTime', String(nextRequestTime));
        values.code = '';
        setNextCodeRequestTime(nextRequestTime);
        localStorage.setItem('isCodeRequested', 'true');
        setIsCodeRequested(true);
        setIsValid(false);
        setIsPasswordShown(false);
        localStorage.setItem('isCodeExpired', 'false');
        setIsCodeExpired(false);
        localStorage.setItem('enteredName', name);
        localStorage.setItem('enteredEmail', email);
        localStorage.setItem('enteredPassword', password);
      })
      .catch((err) => {
        showError(err.response.data.message, 3500, setError, setCodeButtonBlocked);
      });
  }

  return (
    <div className='body'>
      <div className='auth-wrapper'>
        <Header />
        <main className={styles.authorization}>
          <h1 className={styles.authorization__title}>Добро пожаловать!</h1>
          <form className={styles.authorization__form} onSubmit={handleUserRegistration} noValidate>
            <label className={styles.authorization__label}>
              <span className={styles['authorization__input-title']}>Никнейм</span>
              <input
                className={styles.authorization__input}
                name='name'
                type='text'
                id='register-input-name'
                required
                placeholder='Введите никнейм'
                minLength={2}
                maxLength={30}
                autoComplete='no-autocomplete'
                value={values.name || ''}
                onChange={handleChange}
                disabled={!isFormEditing || isCodeRequested}
              />
              {errors.name && <span className='error'>{errors.name}</span>}
            </label>
            <label className={styles.authorization__label}>
              <span className={styles['authorization__input-title']}>E-mail</span>
              <input
                className={styles.authorization__input}
                minLength={7}
                maxLength={60}
                name='email'
                type='email'
                id='register-input-email'
                required
                placeholder='Введите email'
                autoComplete='no-autocomplete'
                value={values.email || ''}
                onChange={handleChange}
                disabled={!isFormEditing || isCodeRequested}
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
                  id='register-input-password'
                  required
                  minLength={8}
                  maxLength={24}
                  placeholder='Введите пароль'
                  autoComplete='no-autocomplete'
                  value={values.password || ''}
                  onChange={handleChange}
                  disabled={!isFormEditing || isCodeRequested}
                />
                {isFormEditing && !isCodeRequested && (
                  <button
                    type='button'
                    className={
                      isPasswordShown ? 'password-switch password-switch_active' : 'password-switch'
                    }
                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                  />
                )}
              </div>
              {errors.password && <span className='error'>{errors.password}</span>}
            </label>
            {!isFormEditing && (
              <>
                <label className={styles.authorization__label}>
                  <span className={styles['authorization__input-title']}>Код подтверждения</span>
                  <input
                    className={styles.authorization__input}
                    name='code'
                    type='text'
                    id='register-input-code'
                    required
                    placeholder='Введите код подтверждения'
                    autoComplete='no-autocomplete'
                    value={values.code || ''}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={6}
                  />
                  {errors.code && <span className='error'>{errors.code}</span>}
                </label>
                <button
                  className={`${styles.authorization__key} ${
                    isValid && !registerButtonBlocked && !isCodeExpired
                      ? 'clickable'
                      : styles.authorization__key_disabled
                  }`}
                  type='submit'
                  disabled={!isValid || registerButtonBlocked || isCodeExpired}>
                  Зарегистрироваться
                </button>
              </>
            )}
            {isFormEditing ? (
              <>
                {!isCodeRequested && (
                  <button
                    className={`${styles.authorization__button} ${
                      isValid && !codeButtonBlocked
                        ? 'clickable'
                        : styles.authorization__button_disabled
                    }`}
                    type='button'
                    disabled={!isValid || codeButtonBlocked}
                    onClick={() => handleGetCode(values.name, values.email, values.password)}>
                    Получить код
                  </button>
                )}
                {isCodeRequested && (
                  <button
                    className={`${styles.authorization__button} ${
                      isValid ? 'clickable' : styles.authorization__button_disabled
                    }`}
                    type='button'
                    onClick={() => {
                      setIsFormEditing(false);
                      setIsValid(false);
                      values.code = '';
                    }}
                    disabled={!isValid}>
                    Ввести код
                  </button>
                )}
                <p className={styles.authorization__text}>
                  Уже зарегистрированы? &nbsp;
                  <Link to='/signin' className={`${styles.authorization__link} clickable`}>
                    {'-> Войти <-'}
                  </Link>
                </p>
                <p
                  className={
                    isCodeRequested ? styles.authorization__msg : styles.authorization__msg_hidden
                  }>
                  Повторно запросить код можно через {remainingTime} секунд
                </p>
              </>
            ) : (
              <>
                <button
                  className={`${styles.authorization__key} clickable`}
                  type='button'
                  onClick={() => {
                    setIsFormEditing(true);
                    setIsValid(true);
                  }}>
                  Назад
                </button>
                <p className={styles.authorization__msg}>
                  Письмо отправлено на указанную почту. Если вы не видите письма, проверьте папку со
                  спамом.
                </p>
              </>
            )}
            {error && <span className='error error_centered'>{error}</span>}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Register;
