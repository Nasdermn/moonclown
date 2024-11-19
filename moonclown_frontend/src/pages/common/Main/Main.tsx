import styles from './Main.module.scss';
import MoonclownSection from '../../../components/MoonclownSection/MoonclownSection';
import ApiSection from '../../../components/ApiSection/ApiSection';
import MailSection from '../../../components/MailSection/MailSection';
import HeartrateSection from '../../../components/HeartrateSection/HeartrateSection';
import clownImage from '../../../assets/images/mainpage/joker.png';
import developerImage from '../../../assets/images/mainpage/developer.png';

function Main() {
  return (
    <main className={styles.main}>
      <img className={styles['main__background-image']} src={clownImage} alt="Background image" />
      <MoonclownSection />
      <ApiSection />
      <MailSection />
      <HeartrateSection />
      <a
        href="https://github.com/Nasdermn"
        target="_blank"
        className={`${styles.main__link} clickable`}>
        <img className={styles.main__image} src={developerImage} alt="Разработчик сайта" />
      </a>
    </main>
  );
}

export default Main;
