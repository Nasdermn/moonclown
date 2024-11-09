import { create } from 'zustand';
import { ICurrentUserState } from '../utils/interfaces';
import { devtools } from 'zustand/middleware';

const useCurrentUser = create(
  devtools<ICurrentUserState>(
    (set) => ({
      userInfo: { name: '', email: '', avatar: '' },
      loggedIn: !!localStorage.getItem('jwt'),
      logoutReason: '',
      setUserInfo: (userInfo) => set({ userInfo }, false, 'setUserInfo'),
      setLoggedIn: (loggedIn) => set({ loggedIn }, false, 'setLoggedIn'),
      setLogoutReason: (reason) => set({ logoutReason: reason }, false, 'setLogoutReason'),
    }),
    { name: 'currentUser' }
  )
);

export default useCurrentUser;
