import { configureStore, combineReducers } from '@reduxjs/toolkit';
import likedMovies from './slices/likedMoviesSlice';
import currentUser from './slices/currentUserSlice';

const rootReducer = combineReducers({ likedMovies, currentUser });

const store = configureStore({
  reducer: rootReducer,
});

export default store;
