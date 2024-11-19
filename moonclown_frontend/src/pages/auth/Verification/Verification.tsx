import styles from '../Registration/Register.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormValidation } from '../../../utils/validation';
import Api from '../../../utils/api';
import { showError } from '../../../utils/showError';

function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { values, handleChange, errors, isValid } = useFormValidation({
    code: '',
  });
  useEffect(() => {
    if (!email) {
      navigate('/auth/register/identify', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    if (isValid) {
      await Api.checkCode(email, values.code)
        .then(() => {
          navigate('/auth/register/complete', {
            state: { email },
            replace: true,
          });
        })
        .catch((err) => {
          showError(err.response.data.message, 2000, setError, setLoading);
        });
    }
  }

  return (
    <main className={styles.authorization}>
      <h1 className={styles.authorization__title}>Регистрация. Шаг 2</h1>
      <form className={styles.authorization__form} onSubmit={handleSubmit} noValidate>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Код подтверждения</span>
          <input
            className={styles.authorization__input}
            name="code"
            type="text"
            id="register-input-code"
            required
            placeholder="Введите код подтверждения"
            autoComplete="no-autocomplete"
            value={values.code || ''}
            onChange={handleChange}
            disabled={loading}
            minLength={6}
            maxLength={6}
          />
          {errors.code && <span className="error">{errors.code}</span>}
        </label>
        <p className={styles.authorization__msg}>
          Письмо отправлено на указанную почту. Если вы не видите письма, проверьте папку со спамом.
        </p>
        {error && <span className="error error_centered">{error}</span>}
        <button
          className={`${styles.authorization__button} ${
            isValid && !loading ? 'clickable' : styles.authorization__button_disabled
          }`}
          type="submit"
          disabled={!isValid || loading}>
          Отправить код
        </button>
        <button
          className={`${styles.authorization__key} clickable`}
          type="button"
          onClick={() => {
            navigate('/auth/register/identify');
          }}>
          Ввести другую почту
        </button>
      </form>
    </main>
  );
}

export default Verification;
