import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState, lazy } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import useCurrentUser from './stores/currentUser.ts';
import NotFound from './pages/common/NotFound/NotFound.tsx';
import Loader from './components/Loader/Loader.tsx';
import getUserData from './utils/getUserData.ts';
import ProtectedLayout from './layouts/ProtectedLayout.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';

const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token);
  return exp ? Date.now() > exp * 1000 : false;
};

function App() {
  const Main = lazy(() => import('./pages/common/Main/Main.tsx'));
  const Movies = lazy(() => import('./pages/common/Movies/Movies.tsx'));
  const SavedMovies = lazy(() => import('./pages/common/SavedMovies/SavedMovies.tsx'));
  const Profile = lazy(() => import('./pages/common/Profile/Profile.tsx'));
  const Authentification = lazy(() => import('./pages/auth/Authentification/Authentification.tsx'));
  const Identification = lazy(() => import('./pages/auth/Identification/Identification.tsx'));
  const Verification = lazy(() => import('./pages/auth/Verification/Verification.tsx'));
  const Registration = lazy(() => import('./pages/auth/Registration/Registration.tsx'));
  const ForgotPassword = lazy(() => import('./pages/password/ForgotPassword/ForgotPassword.tsx'));
  const SendPassword = lazy(() => import('./pages/password/SendPassword/SendPassword.tsx'));
  const ResetPassword = lazy(() => import('./pages/password/ResetPassword/ResetPassword.tsx'));

  const [isLoading, setIsLoading] = useState(true);
  const jwt = localStorage.getItem('jwt');
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
    <div className="body">
      <Loader />
    </div>
  ) : (
    <Routes>
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Main />} />
        <Route path="movies" element={<Movies />} />
        <Route path="saved-movies" element={<SavedMovies />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Authentification />} />
        <Route path="register" element={<Outlet />}>
          <Route index element={<Identification />} />
          <Route path="identify" element={<Identification />} />
          <Route path="verify" element={<Verification />} />
          <Route path="complete" element={<Registration />} />
        </Route>
      </Route>
      <Route path="/password" element={<AuthLayout />}>
        <Route index element={<ForgotPassword />} />
        <Route path="forgot" element={<ForgotPassword />} />
        <Route path="send" element={<SendPassword />} />
        <Route path="reset/:id/:token" element={<ResetPassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
