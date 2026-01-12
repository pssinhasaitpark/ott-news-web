import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
  savedMovies: [],
  likedMovies: [],
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    fetchMoviesStart: (state) => {
      state.loading = true;
    },
    fetchMoviesSuccess: (state, action) => {
      state.movies = action.payload.data;
      state.totalPages = action.payload.total_pages;
      state.currentPage = action.payload.page;
      state.loading = false;
    },
    fetchSavedMoviesSuccess: (state, action) => {
      state.savedMovies = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchLikedMoviesSuccess: (state, action) => {
      state.likedMovies = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchMoviesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    toggleLike: (state, action) => {
      if (!Array.isArray(state.likedMovies)) {
        state.likedMovies = []
      }

      const movieId = action.payload

      if (state.likedMovies.includes(movieId)) {
        state.likedMovies = state.likedMovies.filter(id => id !== movieId)
      } else {
        state.likedMovies.push(movieId)
      }
    },
    toggleSave: (state, action) => {
      const movieId = action.payload;
      if (!Array.isArray(state.savedMovies)) {
        state.savedMovies = [];
      }
      if (state.savedMovies.includes(movieId)) {
        state.savedMovies = state.savedMovies.filter(id => id !== movieId);
      } else {
        state.savedMovies.push(movieId);
      }
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchSavedMoviesSuccess,
  fetchLikedMoviesSuccess,
  fetchMoviesFailure,
  toggleLike,
  toggleSave,
} = movieSlice.actions;

export default movieSlice.reducer;