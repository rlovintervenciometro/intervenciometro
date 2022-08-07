/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    openProfilePopup: false,
    openNewCourseModal: false,
  },
  reducers: {
    toogleOpenProfilePopup: (state, action) => {
      state.openProfilePopup = action.payload.openProfilePopup;
    },
    toggleOpenNewCourseModal: (state, action) => {
      state.openNewCourseModal = action.payload.openNewCourseModal;
    },
  },
});

export const { toogleOpenProfilePopup, toggleOpenNewCourseModal } =
  appSlice.actions;

export default appSlice.reducer;
