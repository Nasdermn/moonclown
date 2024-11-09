import styles from './MoonclownSection.module.scss';
import eyeImage from '../../assets/images/mainpage/bloodeye.svg';

function Moonclown() {
  return (
    <section className={styles.moonclown}>
      <div className={styles.moonclown__titlewrapper}>
        <h1 className={styles.moonclown__title}>moonclown</h1>
        <img className={styles.moonclown__bloodeye} src={eyeImage} alt="BloodEye" />
      </div>
      <p className={styles.moonclown__subtitle}>
        Бесплатный и современный сервис по поиску фильмов
      </p>
    </section>
  );
}

export default Moonclown;
