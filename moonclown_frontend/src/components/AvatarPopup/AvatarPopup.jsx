import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../store/slices/currentUserSlice.js';
import { useFormWithValidation } from '../Validation/Validation.js';
import { showNotification } from '../../utils/showNotification.js';
import Popup from '../Popup/Popup.jsx';
import styles from '../Popup/Popup.module.scss';
import { patchAvatar } from '../../utils/Api.js';

function AvatarPopup({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.currentUser.userInfo);
  const { values, handleChange, errors, isValid, setValues, setErrors } =
    useFormWithValidation({
      avatar: userInfo.avatar,
    });
  const [notification, setNotification] = useState({
    message: '',
    type: 'error',
  });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [buttonBlocked, setButtonBlocked] = useState(false);

  useEffect(() => {
    setIsFormChanged(values.avatar !== userInfo.avatar);
  }, [values.avatar, userInfo.avatar]);

  useEffect(() => {
    if (isOpen) {
      setValues({ avatar: userInfo.avatar });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid) {
      patchAvatar(values.avatar)
        .then((updatedData) => {
          dispatch(setUserInfo(updatedData));
          onClose();
        })
        .catch((err) => {
          showNotification(
            err.response.data.message,
            'error',
            4000,
            setNotification,
            setButtonBlocked
          );
        });
    }
  }
  return (
    <Popup
      title='Изменить фотографию'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onDisable={!isFormChanged || !isValid || buttonBlocked}
    >
      <input
        className={styles.popup__input}
        name='avatar'
        type='text'
        id='profile-input-avatar'
        value={values.avatar || ''}
        onChange={handleChange}
        required
        placeholder='Введите ссылку на фото'
        minLength={10}
      />
      {errors.avatar && (
        <span className={styles.popup__error}>{errors.avatar}</span>
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

export default AvatarPopup;
