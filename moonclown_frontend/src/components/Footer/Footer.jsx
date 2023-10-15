import styles from './Footer.module.scss';
import github from '../../images/socials/github.svg';
import vk from '../../images/socials/vk.svg';
import inst from '../../images/socials/instagram.svg';
import tel from '../../images/socials/telegram.svg';
import yt from '../../images/socials/youtube.svg';

function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.footer__title}>moonclown by Nasdermn</h2>
      <div className={styles.footer__content}>
        <span className={styles.footer__copyright}>© 2023</span>
        <nav className={styles.footer__nav}>
          <a
            className={styles.footer__link}
            href='https://github.com/Nasdermn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={styles.footer__icon} src={github} alt='GitHub' />
          </a>
          <a
            className={styles.footer__link}
            href='https://instagram.com/nasdermn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={styles.footer__icon} src={inst} alt='Instagram' />
          </a>
          <a
            className={styles.footer__link}
            href='https://vk.com/dancauselove'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={styles.footer__icon} src={vk} alt='VK' />
          </a>
          <a
            className={styles.footer__link}
            href='https://www.youtube.com/@nasdermn7394'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={styles.footer__icon} src={yt} alt='Youtube' />
          </a>
          <a
            className={styles.footer__link}
            href='https://t.me/nasdermn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={styles.footer__icon} src={tel} alt='Telegram' />
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
