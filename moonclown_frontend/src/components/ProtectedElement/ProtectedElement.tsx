import { Navigate } from 'react-router-dom';
import { IProtectedElementProps } from '../../utils/interfaces';
import useCurrentUser from '../../stores/currentUser';

function ProtectedElement({ children }: IProtectedElementProps) {
  const loggedIn = useCurrentUser((state) => state.loggedIn);
  const logoutReason = useCurrentUser((state) => state.logoutReason);
  const loginText = logoutReason
    ? [logoutReason, 'Пожалуйста, авторизуйтесь для продолжения.']
    : [
        'Авторизуйтесь!',
        'Вы попытались перейти по роуту, который недоступен неавторизованным пользователям.',
      ];

  if (loggedIn) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" state={{ loginText }} />;
  }
}

export default ProtectedElement;
