import styles from './Moonclown.module.scss';
import moonclown from '../../images/clown1.png';
import bloodeye from '../../images/bloodeye.svg';

function Moonclown() {
  return (
    <section className={styles.moonclown}>
      <div className={styles.moonclown__half}>
        <div className={styles.moonclown__wrap}>
          <h1 className={styles.moonclown__title}>moonclown</h1>
          <img
            className={styles.moonclown__bloodeye}
            src={bloodeye}
            alt='BloodEye'
          />
        </div>
        <div className={styles.moonclown__block}>
          <p className={styles.moonclown__text}>Стек технологий:</p>
          <ul className={styles.moonclown__ul}>
            <li className={styles.moonclown__li}>HTML</li>
            <li className={styles.moonclown__li}>CSS/SCSS</li>
            <li className={styles.moonclown__li}>JS</li>
            <li className={styles.moonclown__li}>Axios</li>
            <li className={styles.moonclown__li}>React</li>
            <li className={styles.moonclown__li}>Redux Toolkit/Redux-thunk</li>
            <li className={styles.moonclown__li}>Express.js</li>
            <li className={styles.moonclown__li}>mongoDB</li>
          </ul>
        </div>
      </div>
      <div className={styles.moonclown__imageblock}>
        <img
          className={styles.moonclown__image}
          src={moonclown}
          alt='Moonclown'
        />
      </div>
    </section>
  );
}

export default Moonclown;
