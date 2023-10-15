import { createSlice } from '@reduxjs/toolkit';

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    userInfo: { name: '', email: '', avatar: '' },
    loggedIn: !!localStorage.getItem('jwt'),
  },
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, userInfo: action.payload };
    },
    setLoggedIn: (state, action) => {
      return { ...state, loggedIn: action.payload };
    },
  },
});

export const { setUserInfo, setLoggedIn } = currentUserSlice.actions;

export default currentUserSlice.reducer;
