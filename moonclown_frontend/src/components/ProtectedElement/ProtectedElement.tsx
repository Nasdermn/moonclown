import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Navigate } from 'react-router-dom';
import { IProtectedElementProps } from '../../utils/interfaces';

function ProtectedElement({ children }: IProtectedElementProps) {
  const loggedIn = useSelector((state: RootState) => state.currentUser.loggedIn);
  const logoutReason = useSelector((state: RootState) => state.currentUser.logoutReason);
  const loginText = logoutReason
    ? [logoutReason, 'Пожалуйста, авторизуйтесь для продолжения.']
    : [
        'Авторизуйтесь!',
        'Вы попытались перейти по роуту, который недоступен неавторизованным пользователям.',
      ];

  if (loggedIn) {
    return <>{children}</>;
  } else {
    return <Navigate to='/signin' state={{ loginText }} />;
  }
}

export default ProtectedElement;
