import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import movieReducer from './slices/movieSlice';
import tvReducer from './slices/tvSlice';
import myListReducer from './slices/myListSlice';
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    movie: movieReducer,
    tv: tvReducer,
    myList: myListReducer,
    ui: uiReducer,
  },
});