import { ThunkAction } from '@reduxjs/toolkit';
import { configureStore, combineReducers, Action } from '@reduxjs/toolkit';
import likedMoviesSlice from './slices/likedMoviesSlice';
import currentUserSlice from './slices/currentUserSlice';

const rootReducer = combineReducers({
  likedMovies: likedMoviesSlice,
  currentUser: currentUserSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
