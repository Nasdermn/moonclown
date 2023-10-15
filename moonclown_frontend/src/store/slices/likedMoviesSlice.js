import { createSlice } from '@reduxjs/toolkit';

const likedMoviesSlice = createSlice({
  name: 'likedMovies',
  initialState: [],
  reducers: {
    setLikedMovies: (state, action) => {
      return action.payload;
    },
    addLikedMovie: (state, action) => {
      state.push(action.payload);
    },
    removeLikedMovie: (state, action) => {
      return state.filter((movie) => movie._id !== action.payload);
    },
  },
});

export const { setLikedMovies, addLikedMovie, removeLikedMovie } =
  likedMoviesSlice.actions;

export default likedMoviesSlice.reducer;
