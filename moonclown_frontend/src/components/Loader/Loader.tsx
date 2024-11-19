import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__container}>
        <span className={styles.loader__round}></span>
      </div>
    </div>
  );
};

export default Loader;
