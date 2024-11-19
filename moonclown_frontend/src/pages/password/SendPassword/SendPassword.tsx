import styles from './SendPassword.module.scss';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function SendPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const sendField = location.state?.send;
  useEffect(() => {
    if (!sendField || sendField !== true) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <main className={styles['send-password']}>
      <h1 className={styles['send-password__title']}>Сброс пароля</h1>
      <p className={styles['send-password__text']}>
        Мы отправили письмо по указанному вами адресу почты. Нажмите на ссылку в сообщении для
        сброса пароля. Если письма нет, проверьте папку для спама.
      </p>
      <Link to="/" className={`${styles['send-password__link']} clickable`}>
        {'-> Вернуться на главную страницу <-'}{' '}
      </Link>
    </main>
  );
}

export default SendPassword;
