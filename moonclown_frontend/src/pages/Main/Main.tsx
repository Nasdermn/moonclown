import styles from './Main.module.scss';
import Header from '../../components/Header/Header';
import MoonclownSection from '../../components/MoonclownSection/MoonclownSection';
import ApiSection from '../../components/ApiSection/ApiSection';
import MailSection from '../../components/MailSection/MailSection';
import HeartrateSection from '../../components/HeartrateSection/HeartrateSection';
import Footer from '../../components/Footer/Footer';
import clownImage from '../../images/mainpage/joker.png';
import developerImage from '../../images/mainpage/developer.png';

function Main() {
  return (
    <div className='body'>
      <Header />
      <main className={styles.main}>
        <img className={styles['main__background-image']} src={clownImage} alt='Background image' />
        <MoonclownSection />
        <ApiSection />
        <MailSection />
        <HeartrateSection />
        <a
          href='https://github.com/Nasdermn'
          target='_blank'
          className={`${styles.main__link} clickable`}>
          <img className={styles.main__image} src={developerImage} alt='Разработчик сайта' />
        </a>
      </main>
      <Footer />
    </div>
  );
}

export default Main;
