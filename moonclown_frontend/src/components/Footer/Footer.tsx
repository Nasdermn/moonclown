import { memo } from 'react';
import styles from './Footer.module.scss';
import githubIcon from '../../images/socials/github.svg';
import vkIcon from '../../images/socials/vk.svg';
import instIcon from '../../images/socials/instagram.svg';
import telIcon from '../../images/socials/telegram.svg';
import ytIcon from '../../images/socials/youtube.svg';

function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.footer__title}>moonclown by Nasdermn</h2>
      <div className={styles.footer__content}>
        <span className={styles.footer__copyright}>© 2023-2024</span>
        <nav className={styles.footer__nav}>
          <a
            className={`${styles.footer__link} clickable`}
            href='https://github.com/Nasdermn/moonclown'
            target='_blank'
            rel='noopener noreferrer'>
            <img className={styles.footer__icon} src={githubIcon} alt='GitHub' />
          </a>
          <a
            className={`${styles.footer__link} clickable`}
            href='https://github.com/Nasdermn/moonclown'
            target='_blank'
            rel='noopener noreferrer'>
            <img className={styles.footer__icon} src={instIcon} alt='Instagram' />
          </a>
          <a
            className={`${styles.footer__link} clickable`}
            href='https://github.com/Nasdermn/moonclown'
            target='_blank'
            rel='noopener noreferrer'>
            <img className={styles.footer__icon} src={vkIcon} alt='VK' />
          </a>
          <a
            className={`${styles.footer__link} clickable`}
            href='https://github.com/Nasdermn/moonclown'
            target='_blank'
            rel='noopener noreferrer'>
            <img className={styles.footer__icon} src={ytIcon} alt='Youtube' />
          </a>
          <a
            className={`${styles.footer__link} clickable`}
            href='https://github.com/Nasdermn/moonclown'
            target='_blank'
            rel='noopener noreferrer'>
            <img className={styles.footer__icon} src={telIcon} alt='Telegram' />
          </a>
        </nav>
      </div>
    </footer>
  );
}

const Footer = memo(FooterComponent);

export default Footer;
