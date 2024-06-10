import { memo, useState, ChangeEvent, FormEvent } from 'react';
import styles from './SearchForm.module.scss';
import { ISearchFormProps } from '../../utils/interfaces';

const SearchFormComponent: React.FC<ISearchFormProps> = ({
  onSubmit,
  searchQuery,
  setSearchQuery,
}) => {
  const [isInputEmpty, setIsInputEmpty] = useState(false);

  function handleInputChange(evt: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(evt.target.value);
    setIsInputEmpty(false);
  }

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    const form = evt.currentTarget;
    const searchInput = form.elements.namedItem('search-movies') as HTMLInputElement;
    const isTextWritten = searchInput.value.trim();
    evt.preventDefault();
    if (!isTextWritten) {
      setIsInputEmpty(true);
    } else {
      onSubmit(1);
    }
  }

  return (
    <form className={styles.searchform} onSubmit={handleSubmit}>
      <label className={styles.searchform__label}>
        <input
          className={styles.searchform__input}
          type='text'
          name='search-movies'
          placeholder='Введите текст для поиска фильмов...'
          onChange={handleInputChange}
          value={searchQuery}
        />
        <button type='submit' className={`${styles.searchform__button} clickable`}></button>
      </label>
      {isInputEmpty && <span className={styles.searchform__error}>Сначала введите текст!</span>}
    </form>
  );
};

const isSearchQueryChanged = (prevProps: ISearchFormProps, nextProps: ISearchFormProps) => {
  return prevProps.searchQuery === nextProps.searchQuery;
};

const SearchForm = memo(SearchFormComponent, isSearchQueryChanged);

export default SearchForm;
