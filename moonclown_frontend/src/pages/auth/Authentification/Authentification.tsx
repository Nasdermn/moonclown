import styles from '../Registration/Register.module.scss';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCurrentUser from '../../../stores/currentUser';
import { useFormValidation } from '../../../utils/validation';
import Api from '../../../utils/api';
import { showError } from '../../../utils/showError';

function Authentification() {
  const setUserInfo = useCurrentUser((state) => state.setUserInfo);
  const setLoggedIn = useCurrentUser((state) => state.setLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const loginText = location.state?.loginText || false;
  const { values, handleChange, errors, isValid } = useFormValidation({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleUserAuthorization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isValid) {
      setLoading(true);
      Api.signin(values.email, values.password)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserInfo({ name: res.name, email: res.email, avatar: res.avatar });
            navigate('/profile', { replace: true });
          }
        })
        .catch((err) => {
          showError(err.response.data.message, 2500, setError, setLoading);
        });
    }
  }

  return (
    <main className={`${styles.authorization} ${styles.authorization_green}`}>
      <h1 className={styles.authorization__title}>
        {loginText ? `${loginText[0]}` : 'Рады видеть!'}
      </h1>
      <form className={styles.authorization__form} onSubmit={handleUserAuthorization} noValidate>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>E-mail</span>
          <input
            className={styles.authorization__input}
            minLength={6}
            maxLength={74}
            name="email"
            type="email"
            id="login-input-email"
            required
            placeholder="Введите email"
            value={values.email || ''}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Пароль</span>
          <div className="password-wrapper">
            <input
              className={styles.authorization__input}
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="login-input-password"
              required
              minLength={8}
              maxLength={24}
              placeholder="Введите пароль"
              value={values.password || ''}
              onChange={handleChange}
              disabled={loading}
            />
            {!loading && (
              <button
                type="button"
                className={
                  showPassword ? 'password-switch password-switch_active' : 'password-switch'
                }
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        {error && <span className="error error_centered">{error}</span>}
        <button
          className={`${styles.authorization__button} ${
            !isValid || loading ? styles.authorization__button_disabled : 'clickable'
          }`}
          type="submit"
          disabled={!isValid || loading}>
          Войти
        </button>
        <p className={styles.authorization__text}>
          Не зарегистрированы? &nbsp;
          <Link to="/auth/register/identify" className={`${styles.authorization__link} clickable`}>
            {'-> Регистрация <-'}
          </Link>
        </p>
        <Link
          to="/password"
          className={`${styles.authorization__link} ${styles.authorization__link_separate} clickable`}>
          Забыли пароль?
        </Link>
        {loginText && <p className={styles.authorization__msg}> {loginText[1]}</p>}
      </form>
    </main>
  );
}

export default Authentification;
