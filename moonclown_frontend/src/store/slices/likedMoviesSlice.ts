import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILikedMovie } from '../../utils/interfaces';

const likedMoviesSlice = createSlice({
  name: 'likedMovies',
  initialState: [] as ILikedMovie[],
  reducers: {
    setLikedMovies: (_state, action: PayloadAction<ILikedMovie[]>) => {
      return action.payload;
    },
    addLikedMovie: (state, action: PayloadAction<ILikedMovie>) => {
      state.push(action.payload);
    },
    removeLikedMovie: (state, action: PayloadAction<number>) => {
      return state.filter((movie) => movie._id !== action.payload);
    },
  },
});

export const { setLikedMovies, addLikedMovie, removeLikedMovie } = likedMoviesSlice.actions;

export default likedMoviesSlice.reducer;
