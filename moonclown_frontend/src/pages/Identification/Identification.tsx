import styles from '../Registration/Register.module.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useFormValidation } from '../../utils/validation';
import Api from '../../utils/api';
import { showError } from '../../utils/showError';

function Identification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { values, handleChange, errors, isValid } = useFormValidation({
    email: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await Api.sendCode(values.email)
      .then(() => {
        navigate('/register/verify', {
          state: {
            email: values.email,
          },
        });
      })
      .catch((err) => {
        showError(err.response.data.message, 3000, setError, setLoading);
      });
  };

  return (
    <div className="body">
      <div className="auth-wrapper">
        <Header />
        <main className={styles.authorization}>
          <h1 className={styles.authorization__title}>Регистрация. Шаг 1</h1>
          <form className={styles.authorization__form} onSubmit={handleSubmit} noValidate>
            <label className={styles.authorization__label}>
              <span className={styles['authorization__input-title']}>E-mail</span>
              <input
                className={styles.authorization__input}
                minLength={6}
                maxLength={74}
                name="email"
                type="email"
                id="register-input-email"
                required
                placeholder="Введите email"
                autoComplete="no-autocomplete"
                value={values.email || ''}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
            <p className={styles.authorization__msg}>
              Введите вашу почту для регистрации. На неё придёт код подтверждения, который нужно
              будет ввести в следующем окне.
            </p>
            {error && <span className="error error_centered">{error}</span>}
            <button
              className={`${styles.authorization__button} ${
                isValid && !loading ? 'clickable' : styles.authorization__button_disabled
              }`}
              type="submit"
              disabled={!isValid || loading}>
              Получить код
            </button>
            <p className={styles.authorization__text}>
              Уже зарегистрированы? &nbsp;
              <Link to="/login" className={`${styles.authorization__link} clickable`}>
                {'-> Войти <-'}
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Identification;
