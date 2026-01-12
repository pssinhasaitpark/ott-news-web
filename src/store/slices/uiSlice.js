import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showAuthModal: false,
    redirectPath: null,
  },
  reducers: {
    openAuthModal: (state, action) => {
      state.showAuthModal = true;
      state.redirectPath = action.payload || "/";
    },
    closeAuthModal: (state) => {
      state.showAuthModal = false;
      state.redirectPath = null;
    },
  },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;
export default uiSlice.reducer;
