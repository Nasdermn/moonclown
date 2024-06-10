import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedElement from './components/ProtectedElement/ProtectedElement.tsx';
import { RootState } from './store/store.ts';
import { setLikedMovies } from './store/slices/likedMoviesSlice.ts';
import { setUserInfo, setLoggedIn } from './store/slices/currentUserSlice.ts';

import Main from './pages/Main/Main.tsx';
import Movies from './pages/Movies/Movies.tsx';
import SavedMovies from './pages/SavedMovies/SavedMovies.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Login from './pages/Login/Login.tsx';
import Register from './pages/Register/Register.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.tsx';
import SendPassword from './pages/SendPassword/SendPassword.tsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.tsx';

import Preloader from './components/Preloader/Preloader.tsx';
import Api from './utils/api.ts';

const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token);
  return exp ? Date.now() > exp * 1000 : false;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.currentUser.loggedIn);

  useEffect(() => {
    const fetchData = async () => {
      if (jwt && !isTokenExpired(jwt)) {
        try {
          const [apiUser, apiMovies] = await Promise.all([Api.getUser(), Api.getSavedMovies()]);
          dispatch(setUserInfo(apiUser));
          dispatch(setLikedMovies(apiMovies));
        } catch (error) {
          console.error('Ошибка при получении данных:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        localStorage.removeItem('jwt');
        dispatch(setLoggedIn(false));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jwt, dispatch]);

  return isLoading ? (
    <div className='body body_centered'>
      <Preloader />
    </div>
  ) : (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route
        path='/movies'
        element={
          <ProtectedElement>
            <Movies />
          </ProtectedElement>
        }
      />
      <Route
        path='/saved-movies'
        element={
          <ProtectedElement>
            <SavedMovies />
          </ProtectedElement>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedElement>
            <Profile />
          </ProtectedElement>
        }
      />
      <Route path='/signin' element={loggedIn ? <Navigate to='/' replace /> : <Login />} />
      <Route path='/signup' element={loggedIn ? <Navigate to='/' replace /> : <Register />} />
      <Route
        path='/forgot-password'
        element={loggedIn ? <Navigate to='/' replace /> : <ForgotPassword />}
      />
      <Route
        path='/send-password'
        element={loggedIn ? <Navigate to='/' replace /> : <SendPassword />}
      />
      <Route
        path='/reset-password/:id/:token'
        element={loggedIn ? <Navigate to='/' replace /> : <ResetPassword />}
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
