import { memo, useState, useEffect } from 'react';
import { useFormValidation } from '../../utils/validation';
import Popup from '../Popup/Popup';
import styles from '../Popup/Popup.module.scss';
import Api from '../../utils/api';
import { showError } from '../../utils/showError';
import { IChildrenPopupProps } from '../../utils/interfaces';

function PasswordPopupComponent({ isOpen, onClose }: IChildrenPopupProps) {
  const { values, handleChange, errors, isValid, setValues, setErrors, setIsValid } =
    useFormValidation({
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
    });
  const [error, setError] = useState('');
  const [buttonBlocked, setButtonBlocked] = useState(false);

  const [showPassword, setShowPassword] = useState({
    oldpassword: false,
    newpassword: false,
    confirmpassword: false,
  });

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    if (isOpen) {
      setValues({});
      setErrors({});
      setIsValid(false);
    }
  }, [isOpen]);

  function handleClose() {
    setShowPassword({ oldpassword: false, newpassword: false, confirmpassword: false });
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setButtonBlocked(true);
    event.preventDefault();
    if (isValid) {
      if (values.oldpassword !== values.newpassword) {
        if (values.newpassword === values.confirmpassword) {
          Api.patchPassword(values.oldpassword, values.newpassword)
            .then(() => {
              setButtonBlocked(false);
              handleClose();
            })
            .catch((err) => showError(err.response.data.message, 2500, setError, setButtonBlocked));
        } else {
          showError(
            'Подтверждение пароля не соответствует новому паролю!',
            2500,
            setError,
            setButtonBlocked
          );
        }
      } else {
        showError('Новый пароль совпадает со старым!', 2500, setError, setButtonBlocked);
      }
    }
  }
  return (
    <Popup
      title="Изменить пароль"
      isOpen={isOpen}
      onClose={() => {
        handleClose();
      }}
      onSubmit={handleSubmit}
      onDisable={!isValid || buttonBlocked}
      isBig>
      <label className={styles.popup__label}>
        <div className="password-wrapper">
          <input
            className={styles.popup__input}
            name="oldpassword"
            type={showPassword.oldpassword ? 'text' : 'password'}
            id="profile-input-old-password"
            autoComplete="no-autocomplete"
            value={values.oldpassword || ''}
            onChange={handleChange}
            required
            placeholder="Введите старый пароль"
            minLength={8}
            maxLength={24}
          />
          {!error && (
            <button
              type="button"
              className={
                showPassword.oldpassword
                  ? 'password-switch password-switch_active'
                  : 'password-switch'
              }
              onClick={() => toggleShowPassword('oldpassword')}></button>
          )}
        </div>
        {errors.oldpassword && <span className="error">{errors.oldpassword}</span>}
      </label>
      <label className={styles.popup__label}>
        <div className="password-wrapper">
          <input
            className={styles.popup__input}
            name="newpassword"
            type={showPassword.newpassword ? 'text' : 'password'}
            id="profile-input-new-password"
            autoComplete="no-autocomplete"
            value={values.newpassword || ''}
            onChange={handleChange}
            required
            placeholder="Введите новый пароль"
            minLength={8}
            maxLength={24}
          />
          {!error && (
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
      <label className={styles.popup__label}>
        <div className="password-wrapper">
          <input
            className={styles.popup__input}
            name="confirmpassword"
            type={showPassword.confirmpassword ? 'text' : 'password'}
            id="profile-input-confirm-password"
            autoComplete="no-autocomplete"
            value={values.confirmpassword || ''}
            onChange={handleChange}
            required
            placeholder="Подтвердите новый пароль"
            minLength={8}
            maxLength={24}
          />
          {!error && (
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
    </Popup>
  );
}

const PasswordPopup = memo(PasswordPopupComponent);

export default PasswordPopup;
