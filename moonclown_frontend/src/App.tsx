import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedElement from './components/ProtectedElement/ProtectedElement.tsx';
import useCurrentUser from './stores/currentUser.ts';

import Main from './pages/Main/Main.tsx';
import Movies from './pages/Movies/Movies.tsx';
import SavedMovies from './pages/SavedMovies/SavedMovies.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Authentification from './pages/Authentification/Authentification.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.tsx';
import SendPassword from './pages/SendPassword/SendPassword.tsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.tsx';
import Identification from './pages/Identification/Identification.tsx';
import Verification from './pages/Verification/Verification.tsx';
import Registration from './pages/Registration/Registration.tsx';

import Preloader from './components/Preloader/Preloader.tsx';
import getUserData from './utils/getUserData.ts';

const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token);
  return exp ? Date.now() > exp * 1000 : false;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const jwt = localStorage.getItem('jwt');
  const loggedIn = useCurrentUser((state) => state.loggedIn);
  const setLoggedIn = useCurrentUser((state) => state.setLoggedIn);

  useEffect(() => {
    const fetchData = async () => {
      if (jwt && !isTokenExpired(jwt)) {
        await getUserData();
      } else {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [jwt]);

  return isLoading ? (
    <div className="body body_centered">
      <Preloader />
    </div>
  ) : (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route
        path="/movies"
        element={
          <ProtectedElement>
            <Movies />
          </ProtectedElement>
        }
      />
      <Route
        path="/saved-movies"
        element={
          <ProtectedElement>
            <SavedMovies />
          </ProtectedElement>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedElement>
            <Profile />
          </ProtectedElement>
        }
      />
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/" replace /> : <Authentification />}
      />
      <Route path="/register">
        <Route index element={<Identification />} />
        <Route path="identify" element={<Identification />} />
        <Route path="verify" element={<Verification />} />
        <Route path="complete" element={<Registration />} />
      </Route>
      <Route
        path="/forgot-password"
        element={loggedIn ? <Navigate to="/" replace /> : <ForgotPassword />}
      />
      <Route
        path="/send-password"
        element={loggedIn ? <Navigate to="/" replace /> : <SendPassword />}
      />
      <Route
        path="/reset-password/:id/:token"
        element={loggedIn ? <Navigate to="/" replace /> : <ResetPassword />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
