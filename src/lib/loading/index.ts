import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  loading: boolean;
}

const initialState = { loading: false } as LoadingState;

const toggleSlice = createSlice({
  name: 'loadingToggle',
  initialState,
  reducers: {
    startLoad(state) {
      state.loading = true;
    },
    endLoad(state) {
      state.loading = false;
    },
    toggle(state) {
      state.loading = !state.loading;
    },
  },
});

export const { startLoad, endLoad, toggle } = toggleSlice.actions;
export default toggleSlice.reducer;
