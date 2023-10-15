import axios from 'axios';
import { API_URL, MAIN_API_URL, MOVIES_API_URL } from './constants';

const mainApi = axios.create({
  baseURL: MAIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const moviesApi = axios.create({
  baseURL: MOVIES_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = () => localStorage.getItem('jwt');

const responseHandler = (res) => {
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  } else {
    throw new Error(
      JSON.stringify({
        status: res.status,
        message: res.data ? res.data.message : 'Произошла ошибка',
      })
    );
  }
};

export const signup = (name, email, password) =>
  mainApi.post('/signup', { name, email, password });

export const signin = (email, password) =>
  mainApi.post('/signin', { email, password }).then(responseHandler);

export const sendCode = (email) =>
  mainApi.post('/getcode', email).then(responseHandler);

export const checkCode = (email, code) =>
  mainApi.post('/checkcode', { email, code }).then(responseHandler);

export const getUser = (jwt) =>
  mainApi
    .get('/users/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(responseHandler);

export const patchName = (name) => {
  const token = getToken();
  return mainApi
    .patch(
      '/users/me/name',
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(responseHandler);
};

export const patchAvatar = (avatar) => {
  const token = getToken();
  return mainApi
    .patch(
      '/users/me/avatar',
      { avatar },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(responseHandler);
};

export const patchPassword = (oldPassword, newPassword) => {
  const token = getToken();
  return mainApi
    .patch(
      '/users/me/password',
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(responseHandler);
};

export const saveMovie = ({
  nameRU,
  nameEN,
  country,
  director,
  duration,
  year,
  description,
  image,
  trailerLink,
  id,
}) => {
  const token = getToken();
  return mainApi
    .post(
      '/movies',
      {
        nameRU,
        nameEN,
        country,
        director,
        duration,
        year,
        description,
        image: API_URL + image.url,
        trailerLink,
        thumbnail: API_URL + image.formats.thumbnail.url,
        movieId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(responseHandler);
};

export const getSavedMovies = () => {
  const token = getToken();
  return mainApi
    .get('/movies', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(responseHandler);
};

export const deleteSavedMovie = (id) => {
  const token = getToken();
  return mainApi
    .delete(`/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(responseHandler);
};

export const getMovies = () => moviesApi.get('/').then(responseHandler);
