/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    openProfilePopup: false,
  },
  reducers: {
    toogleOpenProfilePopup: (state, action) => {
      state.openProfilePopup = action.payload.openProfilePopup;
    },
  },
});

export const { toogleOpenProfilePopup } = appSlice.actions;

export default appSlice.reducer;
