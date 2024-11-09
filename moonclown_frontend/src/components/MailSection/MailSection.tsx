import styles from './MailSection.module.scss';
import { useState, useEffect } from 'react';
import { useFormValidation } from '../../utils/validation';
import Api from '../../utils/api';
import { showError } from '../../utils/showError';
import checkmarkImg from '../../assets/images/mainpage/checkmark.svg';

function MailSection() {
  const [loading, setLoading] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(
    sessionStorage.getItem('isMessageSent') === 'true'
  );
  const [error, setError] = useState('');
  const { values, handleChange, errors, isValid } = useFormValidation({
    email: '',
    name: '',
    message: '',
  });

  useEffect(() => {
    sessionStorage.setItem('isMessageSent', isMessageSent.toString());
  }, [isMessageSent]);

  function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isValid) {
      setLoading(true);
      Api.sendMessage(values.email, values.name, values.message)
        .then(() => setIsMessageSent(true))
        .catch((err) => {
          showError(err.response.data.message, 4000, setError, setLoading);
        });
    }
  }
  return isMessageSent ? (
    <section className={`${styles.mail} ${styles.mail_sent}`}>
      <p className={styles.mail__text}>Ваше сообщение было доставлено.</p>
      <img className={styles.mail__image} src={checkmarkImg} alt="Галочка" />
      <p className={styles.mail__text}>Спасибо за обратную связь!</p>
    </section>
  ) : (
    <section className={styles.mail}>
      <p className={styles.mail__text}>
        Есть вопросы, предложения или пожелания? Оставь нам сообщение в этой форме!
      </p>
      <form className={styles.mail__form} onSubmit={handleSendMessage} noValidate>
        <label className={styles.mail__label}>
          <input
            className={styles.mail__input}
            minLength={6}
            maxLength={74}
            name="email"
            type="email"
            id="msg-input-email"
            required
            placeholder="Email"
            value={values.email || ''}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label className={styles.mail__label}>
          <input
            className={styles.mail__input}
            name="name"
            type="text"
            id="msg-input-name"
            required
            placeholder="Имя"
            minLength={2}
            maxLength={30}
            value={values.name || ''}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label className={styles.mail__label}>
          <textarea
            className={`${styles.mail__input} ${styles.mail__input_textarea}`}
            name="message"
            id="msg-input-message"
            required
            placeholder="Сообщение"
            minLength={20}
            maxLength={1000}
            value={values.message || ''}
            onChange={handleChange}
          />
          {errors.message && <span className="error">{errors.message}</span>}
        </label>
        <span className="error error_centered">{error}</span>
        <button
          className={`${styles.mail__button} ${
            !isValid || loading ? styles.mail__button_disabled : 'clickable'
          }`}
          type="submit"
          disabled={!isValid || loading}>
          Отправить
        </button>
      </form>
    </section>
  );
}

export default MailSection;
