import useCurrentUser from '../stores/currentUser';
import useLikedMovies from '../stores/likedMovies';
import Api from './api';

const getUserData = async () => {
  const setUserInfo = useCurrentUser.getState().setUserInfo;
  const setLikedMovies = useLikedMovies.getState().setLikedMovies;

  try {
    const [apiUser, apiMovies] = await Promise.all([Api.getUser(), Api.getSavedMovies()]);
    setUserInfo(apiUser);
    setLikedMovies(apiMovies);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
};

export default getUserData;
