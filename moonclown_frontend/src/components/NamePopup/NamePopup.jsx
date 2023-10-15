import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../store/slices/currentUserSlice.js';
import { useFormWithValidation } from '../Validation/Validation.js';
import { showNotification } from '../../utils/showNotification.js';
import Popup from '../Popup/Popup.jsx';
import styles from '../Popup/Popup.module.scss';
import { patchName } from '../../utils/Api.js';

function NamePopup({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.currentUser.userInfo);
  const { values, handleChange, errors, isValid, setValues, setErrors } =
    useFormWithValidation({
      name: userInfo.name,
    });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'error',
  });
  const [buttonBlocked, setButtonBlocked] = useState(false);

  useEffect(() => {
    setIsFormChanged(values.name !== userInfo.name);
  }, [values.name, userInfo.name]);

  useEffect(() => {
    if (isOpen) {
      setValues({ name: userInfo.name });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid) {
      patchName(values.name)
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
      title='Изменить имя'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onDisable={!isFormChanged || !isValid || buttonBlocked}
    >
      <input
        className={styles.popup__input}
        name='name'
        type='text'
        id='profile-input-name'
        value={values.name || ''}
        onChange={handleChange}
        required
        placeholder='Введите имя'
        minLength={2}
        maxLength={30}
      />
      {errors.name && (
        <span className={styles.popup__error}>{errors.name}</span>
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

export default NamePopup;
