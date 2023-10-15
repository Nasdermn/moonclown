import { useState, useEffect } from 'react';
import styles from './SearchForm.module.scss';

function SearchForm({
  onSubmit,
  searchQuery,
  setSearchQuery,
  shortFilmChecked,
  setShortFilmChecked,
}) {
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  useEffect(() => {
    setIsInputEmpty(false);
  }, [shortFilmChecked]);

  function handleInputChange(evt) {
    setSearchQuery(evt.target.value);
    setIsInputEmpty(false);
  }

  function handleSubmit(evt) {
    const isTextWritten = evt.target.elements['search-movies'].value.trim();
    evt.preventDefault();
    if (!isTextWritten) {
      setIsInputEmpty(true);
    } else {
      onSubmit();
    }
  }

  return (
    <form className={styles.searchform} onSubmit={handleSubmit}>
      <label
        className={`${styles.searchform__label} ${styles.searchform__label_type_input}`}
      >
        <input
          className={styles.searchform__input}
          type='text'
          name='search-movies'
          placeholder='Введите текст для поиска фильмов...'
          onChange={handleInputChange}
          value={searchQuery}
        />
        <button type='submit' className={styles.searchform__button}></button>
      </label>
      <label
        className={`${styles.searchform__label} ${styles.searchform__label_type_checkbox}`}
      >
        <button
          className={
            !shortFilmChecked
              ? styles.searchform__checkbox
              : `${styles.searchform__checkbox} ${styles.searchform__checkbox_checked}`
          }
          type='button'
          onClick={() => {
            setShortFilmChecked(!shortFilmChecked);
          }}
        />
        <p
          className={
            shortFilmChecked
              ? styles.searchform__text
              : `${styles.searchform__text} ${styles.searchform__text_strikethrough}`
          }
        >
          Короткометражки
        </p>
      </label>
      {isInputEmpty && (
        <span className={styles.searchform__error}>
          Введите текст для поиска
        </span>
      )}
    </form>
  );
}

export default SearchForm;
