import styles from './ApiSection.module.scss';
import kinopoiskImg from '../../assets/images/mainpage/kinopoisk.png';

function ApiSection() {
  return (
    <section className={styles.api}>
      <p className={styles.api__text}>
        Сайт использует один из самых популярных API для кинопоиска в СНГ
      </p>
      <a className={`${styles.api__link} clickable`} href="https://kinopoisk.dev/" target="_blank">
        <img className={styles.api__image} src={kinopoiskImg} alt="Kinopoisk API" />
        <h2 className={styles.api__title}>kinopoisk.dev</h2>
      </a>
    </section>
  );
}

export default ApiSection;
