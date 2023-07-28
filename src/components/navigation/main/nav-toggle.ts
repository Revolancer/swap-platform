import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface NavigationToggleState {
  expanded: boolean;
}

const initialState = { expanded: false } as NavigationToggleState;

const toggleSlice = createSlice({
  name: 'navigationToggle',
  initialState,
  reducers: {
    expand(state) {
      state.expanded = true;
    },
    contract(state) {
      state.expanded = false;
    },
    toggle(state) {
      state.expanded = !state.expanded;
    },
  },
});

export const { expand, contract, toggle } = toggleSlice.actions;
export default toggleSlice.reducer;
