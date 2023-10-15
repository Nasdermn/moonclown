import { useState, useEffect } from 'react';
import { useFormWithValidation } from '../Validation/Validation.js';
import Popup from '../Popup/Popup.jsx';
import styles from '../Popup/Popup.module.scss';
import { patchPassword } from '../../utils/Api.js';
import { showNotification } from '../../utils/showNotification.js';

function PasswordPopup({ isOpen, onClose }) {
  const {
    values,
    handleChange,
    errors,
    isValid,
    setValues,
    setErrors,
    setIsValid,
  } = useFormWithValidation();
  const [notification, setNotification] = useState({
    message: '',
    type: 'error',
  });
  const [buttonBlocked, setButtonBlocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues({});
      setErrors({});
      setIsValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid) {
      if (values.oldpassword !== values.newpassword) {
        if (values.newpassword === values.confirmpassword) {
          patchPassword(values.oldpassword, values.newpassword)
            .then(() => onClose())
            .catch((err) =>
              showNotification(
                err.response.data.message,
                'error',
                4000,
                setNotification,
                setButtonBlocked
              )
            );
        } else {
          showNotification(
            'Подтверждение пароля не соответствует новому паролю',
            'error',
            4000,
            setNotification,
            setButtonBlocked
          );
        }
      } else {
        showNotification(
          'Новый пароль совпадает со старым',
          'error',
          4000,
          setNotification,
          setButtonBlocked
        );
      }
    }
  }
  return (
    <Popup
      title='Изменить пароль'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onDisable={!isValid || buttonBlocked}
    >
      <input
        className={styles.popup__input} // Обновлено использование стилей
        name='oldpassword'
        type='password'
        id='profile-input-old-password'
        value={values.oldpassword || ''}
        onChange={handleChange}
        required
        placeholder='Введите старый пароль'
        minLength={8}
        maxLength={24}
      />
      {errors.oldpassword && (
        <span className={styles.popup__error}>{errors.oldpassword}</span>
      )}
      <input
        className={styles.popup__input} // Обновлено использование стилей
        name='newpassword'
        type='password'
        id='profile-input-new-password'
        value={values.newpassword || ''}
        onChange={handleChange}
        required
        placeholder='Введите новый пароль'
        minLength={8}
        maxLength={24}
      />
      {errors.newpassword && (
        <span className={styles.popup__error}>{errors.newpassword}</span>
      )}
      <input
        className={styles.popup__input} // Обновлено использование стилей
        name='confirmpassword'
        type='password'
        id='profile-input-confirm-password'
        value={values.confirmpassword || ''}
        onChange={handleChange}
        required
        placeholder='Подтвердите новый пароль'
        minLength={8}
        maxLength={24}
      />
      {errors.confirmpassword && (
        <span className={styles.popup__error}>{errors.confirmpassword}</span>
      )}
      {notification.message && (
        <span
          className={`${styles.popup__error} ${styles.popup__error_centered}`}
        >
          {notification.message}
        </span>
      )}
    </Popup>
  );
}

export default PasswordPopup;
