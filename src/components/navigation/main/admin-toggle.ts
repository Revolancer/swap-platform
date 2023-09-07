import { createSlice } from '@reduxjs/toolkit';

interface AdminToggleState {
  adminView: boolean;
}

const initialState = { adminView: false } as AdminToggleState;

const toggleSlice = createSlice({
  name: 'adminToggle',
  initialState,
  reducers: {
    adminView(state) {
      state.adminView = true;
    },
    userView(state) {
      state.adminView = false;
    },
    toggle(state) {
      state.adminView = !state.adminView;
    },
  },
});

export const { adminView, userView, toggle } = toggleSlice.actions;
export default toggleSlice.reducer;
