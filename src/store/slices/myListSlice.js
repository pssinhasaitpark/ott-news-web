import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likedMovies: [],
  savedMovies: [],
  loading: false,
  error: null,
};

const myListSlice = createSlice({
  name: 'myList',
  initialState,
  reducers: {
    fetchLikedMoviesSuccess: (state, action) => {
      state.likedMovies = action.payload;
      state.loading = false;
    },
    fetchSavedMoviesSuccess: (state, action) => {
      state.savedMovies = action.payload;
      state.loading = false;
    },
    fetchMyListFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchLikedMoviesSuccess,
  fetchSavedMoviesSuccess,
  fetchMyListFailure,
} = myListSlice.actions;

export default myListSlice.reducer;
