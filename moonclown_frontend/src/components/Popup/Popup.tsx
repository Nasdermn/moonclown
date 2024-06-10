import styles from './Popup.module.scss';
import { IPopupProps } from '../../utils/interfaces';
import { memo } from 'react';

function PopupComponent({
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
  onDisable,
  isBig,
}: IPopupProps) {
  return (
    <div className={`absolute-wrapper ${isOpen ? 'absolute-wrapper_opened' : ''}`}>
      <div className={isBig ? `${styles.popup} ${styles.popup_big}` : `${styles.popup}`}>
        <button className={`${styles.popup__cross} clickable`} type='button' onClick={onClose} />
        <p className={styles.popup__title}>{title}</p>
        <form
          className={`${styles.popup__form} ${isBig ? styles.popup__form_big : ''}`}
          noValidate={true}
          onSubmit={onSubmit}>
          {children}
          <button
            type='submit'
            className={`${styles.popup__button}
              ${onDisable ? styles.popup__button_disabled : 'clickable'}`}
            disabled={onDisable}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}

const Popup = memo(PopupComponent);

export default Popup;
