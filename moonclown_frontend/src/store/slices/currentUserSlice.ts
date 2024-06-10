import { createSlice } from '@reduxjs/toolkit';

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    userInfo: { name: '', email: '', avatar: '' },
    loggedIn: !!localStorage.getItem('jwt'),
    logoutReason: '',
  },
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, userInfo: action.payload };
    },
    setLoggedIn: (state, action) => {
      return { ...state, loggedIn: action.payload };
    },
    setLogoutReason(state, action) {
      state.logoutReason = action.payload;
    },
  },
});

export const { setUserInfo, setLoggedIn, setLogoutReason } = currentUserSlice.actions;

export default currentUserSlice.reducer;
