import styles from './Register.module.scss';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setLoggedIn,
  setUserInfo,
} from '../../store/slices/currentUserSlice.js';
import Header from '../Header/Header.jsx';
import { useFormWithValidation } from '../Validation/Validation.js';
import {
  checkCode,
  sendCode,
  signup,
  signin,
  getUser,
} from '../../utils/Api.js';
import { showNotification } from '../../utils/showNotification.js';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, handleChange, errors, isValid, setIsValid } =
    useFormWithValidation();
  const [isFormEditing, setIsFormEditing] = useState(true);
  const [registerButtonBlocked, setRegisterButtonBlocked] = useState(false);
  const [codeButtonBlocked, setCodeButtonBlocked] = useState(false);
  const [lastCode, setLastCode] = useState('');
  const [lastEmail, setLastEmail] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    type: 'success', // 'success' или 'error'
  });
  const [isCodeRequested, setIsCodeRequested] = useState(
    localStorage.getItem('isCodeRequested') === 'true' || false
  );
  const [nextCodeRequestTime, setNextCodeRequestTime] = useState(
    parseInt(localStorage.getItem('nextCodeRequestTime')) || 0
  );
  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, Math.ceil((nextCodeRequestTime - Date.now()) / 1000))
  );
  const [isCodeExpired, setIsCodeExpired] = useState(
    localStorage.getItem('isCodeExpired') === 'true' || false
  );
  const isFormEditingRef = useRef(isFormEditing);

  useEffect(() => {
    // Обновляем значение isFormEditingRef при изменении isFormEditing
    isFormEditingRef.current = isFormEditing;
  }, [isFormEditing]);

  // Эффект для обновления состояния isCodeRequested и nextCodeRequestTime
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
    // При загрузке компонента, проверяем, был ли сохранен email
    const savedEmail = localStorage.getItem('enteredEmail');
    if (savedEmail && isCodeRequested) {
      // Если email сохранен и кнопка была нажата, то отображаем его и делаем инпут disabled
      values.email = savedEmail;
      setIsValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUserRegistration(event) {
    setRegisterButtonBlocked(true);
    event.preventDefault();

    if (isValid) {
      try {
        const checkCodeResponse = await checkCode(values.email, values.code);
        if (checkCodeResponse.status === 200) {
          signup(values.name, values.email, values.password)
            .then(() => {
              return signin(values.email, values.password);
            })
            .then((data) => {
              if (data.token) {
                localStorage.setItem('jwt', data.token);
                localStorage.removeItem('isCodeRequested');
                localStorage.removeItem('enteredEmail');
                localStorage.removeItem('nextCodeRequestTime');
                localStorage.removeItem('isCodeExpired');
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
              showNotification(
                err.response.data.message,
                'error',
                5000,
                setNotification
              );
            });
        }
      } catch (err) {
        if (err.response.status === 400) {
          // Если ошибка 400, разблокируем кнопку через 5 секунд
          setTimeout(() => {
            setRegisterButtonBlocked(false);
            setLastCode(values.code);
            values.code = '';
            if (!isFormEditingRef.current) {
              setIsValid(false);
            }
          }, 5000);
        }
        if (err.response.status === 410) {
          localStorage.setItem('isCodeExpired', true);
        }
        showNotification(
          err.response.data.message,
          'error',
          5000,
          setNotification
        );
      }
    }
  }

  async function handleGetCode(mail) {
    await sendCode({ email: mail })
      .then(({ message }) => {
        showNotification(message, 'success', 2000, setNotification);
        setIsFormEditing(false);
        const nextRequestTime = Date.now() + 60 * 1000;
        localStorage.setItem('nextCodeRequestTime', nextRequestTime);
        values.code = '';
        setNextCodeRequestTime(nextRequestTime);
        localStorage.setItem('isCodeRequested', 'true');
        setIsCodeRequested(true);
        setIsValid(false);
        localStorage.setItem('isCodeExpired', false);
        setIsCodeExpired(false);
        localStorage.setItem('enteredEmail', mail);
      })
      .catch((err) => {
        err.response.status === 400
          ? showNotification(
              'Пожалуйста, введите настоящий адрес электронной почты.',
              'error',
              5000,
              setNotification,
              setCodeButtonBlocked
            )
          : showNotification(
              err.response.data.message,
              'error',
              5000,
              setNotification,
              setCodeButtonBlocked
            );
        setTimeout(() => {
          setLastEmail(values.email);
          values.email = '';
          setIsValid(false);
        }, 5000);
      });
  }

  return (
    <div className='body'>
      <div className='wrapper'>
        <Header />
        <main className={styles.register}>
          <h1 className={styles.register__title}>Добро пожаловать 🤡</h1>
          <form
            className={styles.register__form}
            onSubmit={handleUserRegistration}
            noValidate
          >
            <label className={styles.register__label}>
              <span className={styles.register__input_title}>Имя</span>
              <input
                className={styles.register__input}
                name='name'
                type='text'
                id='register-input-name'
                required
                placeholder='Введите имя'
                minLength={2}
                maxLength={30}
                value={values.name || ''}
                onChange={handleChange}
                disabled={!isFormEditing}
              />
              {errors.name && (
                <span className={styles.register__input_error}>
                  {errors.name}
                </span>
              )}
            </label>
            <label className={styles.register__label}>
              <span className={styles.register__input_title}>E-mail</span>
              <input
                className={styles.register__input}
                name='email'
                type='email'
                id='register-input-email'
                required
                placeholder='Введите email'
                value={values.email || ''}
                onChange={handleChange}
                disabled={!isFormEditing || isCodeRequested}
              />
              {errors.email && (
                <span className={styles.register__input_error}>
                  {errors.email}
                </span>
              )}
            </label>
            <label className={styles.register__label}>
              <span className={styles.register__input_title}>Пароль</span>
              <input
                className={styles.register__input}
                name='password'
                type='password'
                id='register-input-password'
                required
                minLength={8}
                maxLength={24}
                placeholder='Введите пароль'
                value={values.password || ''}
                onChange={handleChange}
                disabled={!isFormEditing}
              />
              {errors.password && (
                <span className={styles.register__input_error}>
                  {errors.password}
                </span>
              )}
            </label>
            {!isFormEditing && (
              <>
                <label className={styles.register__label}>
                  <span className={styles.register__input_title}>
                    Код подтверждения
                  </span>
                  <input
                    className={styles.register__input}
                    name='code'
                    type='text'
                    id='register-input-code'
                    required
                    placeholder='Введите шестизначный код подтверждения'
                    value={values.code || ''}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={6}
                  />
                  {errors.code && (
                    <span className={styles.register__input_error}>
                      {errors.code}
                    </span>
                  )}
                </label>
                <button
                  className={`${styles.register__key} ${
                    isValid &&
                    !registerButtonBlocked &&
                    lastCode !== values.code &&
                    !isCodeExpired
                      ? styles.register__key_enabled
                      : ''
                  }`}
                  type='submit'
                  disabled={
                    !isValid ||
                    registerButtonBlocked ||
                    lastCode === values.code ||
                    isCodeExpired
                  }
                >
                  Зарегистрироваться
                </button>
              </>
            )}
            {isFormEditing ? (
              <>
                {!isCodeRequested && (
                  <button
                    className={`${styles.register__button} ${
                      isValid &&
                      lastEmail !== values.email &&
                      !codeButtonBlocked
                        ? styles.register__button_enabled
                        : ''
                    }`}
                    type='button'
                    disabled={
                      !isValid ||
                      lastEmail === values.email ||
                      codeButtonBlocked
                    }
                    onClick={() => handleGetCode(values.email)}
                  >
                    Получить код
                  </button>
                )}
                {isCodeRequested && (
                  <button
                    className={`${styles.register__button} ${
                      isValid ? styles.register__button_enabled : ''
                    }`}
                    type='button'
                    onClick={() => {
                      setIsFormEditing(false);
                      setIsValid(false);
                      values.code = '';
                    }}
                    disabled={!isValid}
                  >
                    Ввести код
                  </button>
                )}
                <p className={styles.register__text}>
                  Уже зарегистрированы? &nbsp;
                  <Link to='/signin' className={styles.register__link}>
                    Войти
                  </Link>
                </p>
                <p
                  className={
                    isCodeRequested
                      ? styles.register__msg
                      : styles.register__msg_hidden
                  }
                >
                  Повторно запросить код можно через {remainingTime} секунд
                </p>
              </>
            ) : (
              <>
                <button
                  className={`${styles.register__key} ${styles.register__key_enabled}`}
                  type='button'
                  onClick={() => {
                    setIsFormEditing(true);
                    setIsValid(true);
                  }}
                >
                  Назад
                </button>
                <p className={styles.register__msg}>
                  Не забудьте проверить папку спама - скорее всего, письмо там.
                </p>
              </>
            )}
            {notification.message && (
              <span
                className={`
                  ${
                    notification.type === 'success'
                      ? styles.register__input_success
                      : styles.register__input_error
                  }
                      ${styles.register__input_error_centered}`}
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

export default Register;
