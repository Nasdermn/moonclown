import styles from './SendPassword.module.scss';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';

function SendPassword() {
  return (
    <div className='body'>
      <div className='auth-wrapper'>
        <Header />
        <main className={styles['send-password']}>
          <h1 className={styles['send-password__title']}>Сброс пароля</h1>
          <p className={styles['send-password__text']}>
            Мы отправили письмо по указанному вами адресу почты. Нажмите на ссылку в сообщении для
            сброса пароля. Если письма нет, проверьте папку для спама.
          </p>
          <Link to='/' className={`${styles['send-password__link']} clickable`}>
            {'-> Вернуться на главную страницу <-'}{' '}
          </Link>
        </main>
      </div>
    </div>
  );
}

export default SendPassword;
