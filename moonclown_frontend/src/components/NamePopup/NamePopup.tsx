import { memo, useState, useEffect } from 'react';
import useCurrentUser from '../../stores/currentUser.ts';
import { useFormValidation } from '../../utils/validation.ts';
import { showError } from '../../utils/showError.ts';
import Popup from '../Popup/Popup';
import styles from '../Popup/Popup.module.scss';
import Api from '../../utils/api.ts';
import { IChildrenPopupProps } from '../../utils/interfaces';

function NamePopupComponent({ isOpen, onClose }: IChildrenPopupProps) {
  const userInfo = useCurrentUser((state) => state.userInfo);
  const setUserInfo = useCurrentUser((state) => state.setUserInfo);
  const { values, handleChange, errors, isValid, setValues, setErrors } = useFormValidation({
    name: userInfo.name,
  });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFormChanged(values.name !== userInfo.name);
  }, [values.name, userInfo.name]);

  useEffect(() => {
    if (isOpen) {
      setValues({ name: userInfo.name });
      setErrors({});
    }
  }, [isOpen]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValid) {
      Api.patchName(values.name)
        .then((updatedData) => {
          setUserInfo(updatedData);
          onClose();
        })
        .catch((err) => {
          showError(err.response.data.message, 4000, setError, setLoading);
        });
    }
  }
  return (
    <Popup
      title="Изменить имя"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onDisable={!isFormChanged || !isValid || loading}>
      <input
        className={styles.popup__input}
        name="name"
        type="text"
        id="profile-input-name"
        value={values.name || ''}
        onChange={handleChange}
        required
        placeholder="Введите имя"
        minLength={2}
        maxLength={30}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      {error && <span className="error error_centered">{error}</span>}
    </Popup>
  );
}

const NamePopup = memo(NamePopupComponent);

export default NamePopup;
