import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import useCurrentUser from '../stores/currentUser';
import Loader from '../components/Loader/Loader';

function AuthLayout() {
  const loggedIn = useCurrentUser((state) => state.loggedIn);
  if (loggedIn) {
    return <Navigate to="/" replace />;
  } else
    return (
      <div className="body">
        <Suspense fallback={<Loader />}>
          <div className="auth-wrapper">
            <Header />
            <Outlet />
          </div>
        </Suspense>
      </div>
    );
}

export default AuthLayout;
