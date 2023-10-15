import jwt_decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRouteElement from '../ProtectedRoute/ProtectedRoute.js';
import { setLikedMovies } from '../../store/slices/likedMoviesSlice.js';
import {
  setUserInfo,
  setLoggedIn,
} from '../../store/slices/currentUserSlice.js';

import Main from '../Main/Main.jsx';
import Movies from '../Movies/Movies.jsx';
import SavedMovies from '../SavedMovies/SavedMovies.jsx';
import Profile from '../Profile/Profile.jsx';
import Login from '../Login/Login.jsx';
import Register from '../Register/Register.jsx';
import NotFound from '../NotFound/NotFound.jsx';
import Preloader from '../Preloader/Preloader.jsx';
import { getUser, getSavedMovies } from '../../utils/Api.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.currentUser.loggedIn);

  useEffect(() => {
    const isUserLogged = () => {
      //проверяем, не истёк ли токен
      const tokenStatus = () => {
        if (jwt) {
          return jwt_decode(jwt).exp - Math.floor(Date.now() / 1000) > 86400
            ? 1
            : 2;
        }
        return 3;
      };
      if (loggedIn && tokenStatus() === 1) {
        Promise.all([getUser(jwt), getSavedMovies()])
          .then(([apiUser, apiMovies]) => {
            //Отрисовка профиля
            dispatch(setUserInfo(apiUser));
            //Отрисовка карточек
            dispatch(setLikedMovies(apiMovies));
            //Остановка загрузки
            setIsLoading(false);
          })
          .catch((err) => console.log(err))
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        if (tokenStatus() === 2) {
          // Токен истечет менее, чем через день! выходим из системы
          localStorage.removeItem('jwt');
          dispatch(setLoggedIn(false));
        }
      }
    };

    isUserLogged();

    //будем проверять токен раз в день, если вдруг пользователь будет несколько дней сидеть на сайте
    const tokenCheckInterval = setInterval(isUserLogged, 86400 * 1000);

    return () => {
      // Очищаем интервал при размонтировании компонента
      clearInterval(tokenCheckInterval);
    };
  }, [jwt, loggedIn, dispatch]);

  if (isLoading) {
    return (
      <div className='preloader__wrapper'>
        <Preloader />
      </div>
    );
  } else {
    return (
      <Routes>
        <Route path='/' element={<Main />} />
        <Route
          path='/movies'
          element={<ProtectedRouteElement element={Movies} />}
        />
        <Route
          path='/saved-movies'
          element={<ProtectedRouteElement element={SavedMovies} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRouteElement element={Profile} />}
        />
        <Route
          path='/signin'
          element={loggedIn ? <Navigate to='/' replace /> : <Login />}
        />
        <Route
          path='/signup'
          element={loggedIn ? <Navigate to='/' replace /> : <Register />}
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    );
  }
}

export default App;
