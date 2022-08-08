/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    openProfilePopup: false,
    openNewCourseModal: false,
    openNewParticipationModal: false,
    openNewStudentsModal: false,
    openNewOptionsModal: false,
    selectedCourseId: null,
  },
  reducers: {
    setSelectedCourseId: (state, action) => {
      state.selectedCourseId = action.payload.selectedCourseId;
    },
    toogleOpenProfilePopup: (state, action) => {
      state.openProfilePopup = action.payload.openProfilePopup;
    },
    toggleOpenNewCourseModal: (state, action) => {
      state.openNewCourseModal = action.payload.openNewCourseModal;
    },
    toggleOpenNewParticipationModal: (state, action) => {
      state.openNewParticipationModal =
        action.payload.openNewParticipationModal;
    },
    toggleOpenNewStudentsModal: (state, action) => {
      state.openNewStudentsModal = action.payload.openNewStudentsModal;
    },
    toggleOpenNewOptionsModal: (state, action) => {
      state.openNewOptionsModal = action.payload.openNewOptionsModal;
    },
  },
});

export const {
  toogleOpenProfilePopup,
  toggleOpenNewCourseModal,
  toggleOpenNewParticipationModal,
  toggleOpenNewStudentsModal,
  toggleOpenNewOptionsModal,
  setSelectedCourseId,
} = appSlice.actions;

export default appSlice.reducer;
