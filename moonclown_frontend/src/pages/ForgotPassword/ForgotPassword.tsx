import styles from '../Registration/Register.module.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useFormValidation } from '../../utils/validation';
import Api from '../../utils/api';
import { showError } from '../../utils/showError';

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { values, handleChange, errors, isValid } = useFormValidation({
    email: '',
  });

  function handleSendLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isValid) {
      setLoading(true);
      Api.recoverPassword(values.email)
        .then(() => {
          navigate('/send-password');
        })
        .catch((err) => {
          showError(err.response.data.message, 2500, setError, setLoading);
        });
    }
  }

  return (
    <div className="body">
      <div className="auth-wrapper">
        <Header />
        <main className={`${styles.authorization} ${styles.authorization_blue}`}>
          <h1 className={styles.authorization__title}>Сброс пароля</h1>
          <form className={styles.authorization__form} noValidate onSubmit={handleSendLink}>
            <label className={styles.authorization__label}>
              <span className={styles['authorization__input-title']}>E-mail</span>
              <input
                className={styles.authorization__input_red}
                minLength={6}
                maxLength={74}
                name="email"
                type="email"
                id="forgot-password-input-email"
                required
                placeholder="Введите email"
                value={values.email || ''}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
            {error && <span className="error error_centered">{error}</span>}
            <button
              className={`${styles.authorization__button} ${styles.authorization__button_long} ${
                !isValid || loading ? styles.authorization__button_disabled : 'clickable'
              }`}
              disabled={!isValid || loading}
              type="submit">
              Прислать ссылку мне на почту
            </button>
            <Link
              to="/login"
              className={`${styles.authorization__link} ${styles.authorization__link_separate} clickable`}>
              Назад
            </Link>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;
