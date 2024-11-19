import styles from './Register.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCurrentUser from '../../../stores/currentUser';
import { useFormValidation } from '../../../utils/validation';
import Api from '../../../utils/api';
import { showError } from '../../../utils/showError';

function Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUserInfo = useCurrentUser((state) => state.setUserInfo);
  const setLoggedIn = useCurrentUser((state) => state.setLoggedIn);
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { values, handleChange, errors, isValid } = useFormValidation({
    name: '',
    password: '',
    confirmpassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmpassword: false,
  });

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    if (!email) {
      navigate('/auth/register/verify', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    if (isValid) {
      if (values.password === values.confirmpassword) {
        Api.signup(values.name, email, values.password)
          .then(() => {
            return Api.signin(email, values.password);
          })
          .then((res) => {
            if (res) {
              setLoggedIn(true);
              setUserInfo({ name: res.name, email: res.email, avatar: res.avatar });
              navigate('/', { replace: true });
            }
          })
          .catch((err) => {
            showError(err.response.data.message, 2000, setError, setLoading);
          });
      } else {
        showError('Пароли не совпадают!', 2000, setError, setLoading);
      }
    }
  }

  return (
    <main className={styles.authorization}>
      <h1 className={styles.authorization__title}>Регистрация. Шаг 3</h1>
      <form className={styles.authorization__form} onSubmit={handleSubmit} noValidate>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Никнейм</span>
          <input
            className={styles.authorization__input}
            name="name"
            type="text"
            id="register-input-name"
            required
            placeholder="Введите никнейм"
            minLength={2}
            maxLength={30}
            autoComplete="no-autocomplete"
            value={values.name || ''}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Пароль</span>
          <div className="password-wrapper">
            <input
              className={styles.authorization__input}
              name="password"
              type={showPassword.password ? 'text' : 'password'}
              id="register-input-password"
              required
              minLength={8}
              maxLength={24}
              placeholder="Введите пароль"
              autoComplete="no-autocomplete"
              value={values.password || ''}
              onChange={handleChange}
              disabled={loading}
            />
            {!loading && (
              <button
                type="button"
                className={
                  showPassword.password
                    ? 'password-switch password-switch_active'
                    : 'password-switch'
                }
                onClick={() => toggleShowPassword('password')}></button>
            )}
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Подтверждение пароля</span>
          <div className="password-wrapper">
            <input
              className={styles.authorization__input}
              name="confirmpassword"
              type={showPassword.confirmpassword ? 'text' : 'password'}
              id="register-input-confirm-password"
              required
              minLength={8}
              maxLength={24}
              placeholder="Подтвердите пароль"
              autoComplete="no-autocomplete"
              value={values.confirmpassword || ''}
              onChange={handleChange}
              disabled={loading}
            />
            {!loading && (
              <button
                type="button"
                className={
                  showPassword.confirmpassword
                    ? 'password-switch password-switch_active'
                    : 'password-switch'
                }
                onClick={() => toggleShowPassword('confirmpassword')}></button>
            )}
          </div>
          {errors.confirmpassword && <span className="error">{errors.confirmpassword}</span>}
        </label>
        {error && <span className="error error_centered">{error}</span>}
        <button
          className={`${styles.authorization__key} ${
            isValid && !loading ? 'clickable' : styles.authorization__key_disabled
          }`}
          type="submit"
          disabled={!isValid || loading}>
          Зарегистрироваться
        </button>

        <button
          className={`${styles.authorization__key} clickable`}
          type="button"
          onClick={() => {
            navigate('/auth/register/identify');
          }}>
          Отмена
        </button>
      </form>
    </main>
  );
}

export default Registration;
