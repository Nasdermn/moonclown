import { setLikedMovies } from '../store/slices/likedMoviesSlice';
import { setUserInfo } from '../store/slices/currentUserSlice';
import Api from './api';
import { Dispatch } from '@reduxjs/toolkit';

const getUserData = async (dispatch: Dispatch) => {
  try {
    const [apiUser, apiMovies] = await Promise.all([Api.getUser(), Api.getSavedMovies()]);
    dispatch(setUserInfo(apiUser));
    dispatch(setLikedMovies(apiMovies));
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
};

export default getUserData;
