import styles from '../../auth/Registration/Register.module.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../../../utils/api';
import NotFound from '../../common/NotFound/NotFound';
import { useFormValidation } from '../../../utils/validation';
import Loader from '../../../components/Loader/Loader';
import { showError } from '../../../utils/showError';

function ResetPassword() {
  const { id, token } = useParams<{ id: string; token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const { values, handleChange, errors, isValid } = useFormValidation({
    newpassword: '',
    confirmpassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState({
    newpassword: false,
    confirmpassword: false,
  });

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        await Api.checkLink(id!, token!);
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
      }
    };
    checkTokenValidity();
  }, [id, token]);

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.newpassword !== values.confirmpassword) {
      showError('Пароли не совпадают.', 1700, setError, setLoading);
      return;
    }

    if (isValid) {
      setLoading(true);
      Api.updatePassword(id!, token!, values.confirmpassword)
        .then(() => {
          navigate('/auth/login', {
            state: {
              loginText: ['Пароль был обновлён', 'Теперь вы можете войти с новым паролем.'],
            },
          });
        })
        .catch((err) => {
          showError(err.response.data.message, 3500, setError, setLoading);
        });
    }
  };

  if (isValidToken === null) {
    return (
      <div className="body">
        <Loader />
      </div>
    );
  }

  if (isValidToken === false) {
    return <NotFound />;
  }

  return (
    <main className={`${styles.authorization} ${styles.authorization_pink}`}>
      <h2 className={styles.authorization__title}>Сброс пароля</h2>
      <form className={styles.authorization__form} onSubmit={handlePasswordReset} noValidate>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Новый пароль</span>
          <div className="password-wrapper">
            <input
              className={styles.authorization__input}
              name="newpassword"
              type={showPassword.newpassword ? 'text' : 'password'}
              id="reset-password-input-new-password"
              autoComplete="no-autocomplete"
              value={values.newpassword || ''}
              onChange={handleChange}
              required
              placeholder="Введите пароль"
              minLength={8}
              maxLength={24}
              disabled={loading}
            />
            {!loading && (
              <button
                type="button"
                className={
                  showPassword.newpassword
                    ? 'password-switch password-switch_active'
                    : 'password-switch'
                }
                onClick={() => toggleShowPassword('newpassword')}></button>
            )}
          </div>
          {errors.newpassword && <span className="error">{errors.newpassword}</span>}
        </label>
        <label className={styles.authorization__label}>
          <span className={styles['authorization__input-title']}>Подтвердите новый пароль</span>
          <div className="password-wrapper">
            <input
              className={styles.authorization__input}
              name="confirmpassword"
              type={showPassword.confirmpassword ? 'text' : 'password'}
              id="reset-password-input-confirm-password"
              autoComplete="no-autocomplete"
              value={values.confirmpassword || ''}
              onChange={handleChange}
              required
              placeholder="Введите пароль ещё раз"
              minLength={8}
              maxLength={24}
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
          className={`${styles.authorization__button} ${
            !isValid || loading ? styles.authorization__button_disabled : 'clickable'
          }`}
          type="submit"
          disabled={!isValid || loading}>
          Изменить пароль
        </button>
      </form>
    </main>
  );
}

export default ResetPassword;
