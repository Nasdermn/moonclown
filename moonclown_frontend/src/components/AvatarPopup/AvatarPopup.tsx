import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/slices/currentUserSlice';
import { showError } from '../../utils/showError';
import Popup from '../Popup/Popup';
import styles from '../Popup/Popup.module.scss';
import Api from '../../utils/api';
import { IChildrenPopupProps } from '../../utils/interfaces';

function AvatarPopupComponent({ isOpen, onClose }: IChildrenPopupProps) {
  const dispatch = useDispatch();
  const [fileKey, setFileKey] = useState(0);
  const [img, setImg] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [buttonBlocked, setButtonBlocked] = useState(true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData();
    if (img) {
      data.append('image', img);
    }
    Api.patchAvatar(data)
      .then((response) => {
        dispatch(setUserInfo(response.user));
        handleClose();
      })
      .catch((err) => {
        showError(err.response.data.message, 4000, setError, setButtonBlocked);
      });
  }

  function handleClose() {
    setImg(null);
    setButtonBlocked(true);
    setFileKey((prev) => prev + 1);
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImg(e.target.files ? e.target.files[0] : null);
    setButtonBlocked(!e.target.files || !e.target.files[0]);
  }

  return (
    <Popup
      title='Изменить фотографию'
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onDisable={buttonBlocked}>
      <input
        key={fileKey}
        type='file'
        accept='.png, .jpg, .jpeg'
        onChange={handleFileChange}
        className={styles.popup__input}
      />
      {error && <span className='error error_centered'>{error}</span>}
    </Popup>
  );
}

const AvatarPopup = memo(AvatarPopupComponent);

export default AvatarPopup;
