import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRouteElement = ({ element: Component, ...props }) => {
  const loggedIn = useSelector((state) => state.currentUser.loggedIn);
  return loggedIn ? <Component {...props} /> : <Navigate to='/' replace />;
};

export default ProtectedRouteElement;
