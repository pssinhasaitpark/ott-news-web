import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tvShows: [],
  likedTVShows: [],
  savedTVShows: [],
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {
    fetchTVShowsStart: (state) => {
      state.loading = true;
    },
    fetchTVShowsSuccess: (state, action) => {
      state.tvShows = action.payload.data;
      state.totalPages = action.payload.total_pages;
      state.currentPage = action.payload.page;
      state.loading = false;
    },
    fetchTVShowsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchLikedTVSuccess: (state, action) => {
      state.likedTVShows = action.payload;
    },
    fetchSavedTVSuccess: (state, action) => {
      state.savedTVShows = action.payload;
    },
    toggleLike: (state, action) => {
      const id = action.payload;
      if (state.likedTVShows.includes(id)) {
        state.likedTVShows = state.likedTVShows.filter(i => i !== id);
      } else {
        state.likedTVShows.push(id);
      }
    },
    toggleSave: (state, action) => {
      const id = action.payload;
      if (state.savedTVShows.includes(id)) {
        state.savedTVShows = state.savedTVShows.filter(i => i !== id);
      } else {
        state.savedTVShows.push(id);
      }
    },
  },
});

export const {
  fetchTVShowsStart,
  fetchTVShowsSuccess,
  fetchTVShowsFailure,
  fetchLikedTVSuccess,
  fetchSavedTVSuccess,
  toggleLike,
  toggleSave,
} = tvSlice.actions;

export default tvSlice.reducer;
