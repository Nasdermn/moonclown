import styles from './Popup.module.scss';

function Popup({ title, children, isOpen, onClose, onSubmit, onDisable }) {
  return (
    <div className={`${styles.popup} ${isOpen ? styles.popup_opened : ''}`}>
      <div className={styles.popup__container}>
        <button
          className={styles.popup__cross}
          type='button'
          onClick={onClose}
        />
        <p className={styles.popup__title}>{title}</p>
        <form className={styles.popup__form} noValidate='' onSubmit={onSubmit}>
          {children}
          <button
            type='submit'
            className={
              onDisable
                ? `${styles.popup__button} ${styles.popup__button_disabled}`
                : styles.popup__button
            }
            disabled={onDisable}
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}

export default Popup;
