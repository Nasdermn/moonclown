import { Suspense } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import useCurrentUser from '../stores/currentUser';
import Loader from '../components/Loader/Loader';

function ProtectedLayout() {
  const location = useLocation();
  const loggedIn = useCurrentUser((state) => state.loggedIn);
  const logoutReason = useCurrentUser((state) => state.logoutReason);
  const loginText = logoutReason
    ? [logoutReason, 'Пожалуйста, авторизуйтесь для продолжения.']
    : [
        'Авторизуйтесь!',
        'Вы попытались перейти по роуту, который недоступен неавторизованным пользователям.',
      ];

  if (!loggedIn && !(location.pathname === '/')) {
    return <Navigate to="/auth/login" state={{ loginText }} />;
  } else
    return (
      <div className="body">
        <Header />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    );
}

export default ProtectedLayout;
