import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IndicatorsState {
  notifsUnread: number;
  messagesUnread: number;
}

const initialState = {
  notifsUnread: 0,
  messagesUnread: 0,
} as IndicatorsState;

const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    setNotifsUnread(state, action: PayloadAction<number>) {
      state.notifsUnread = action.payload;
    },
    setMessagesUnread(state, action: PayloadAction<number>) {
      state.messagesUnread = action.payload;
    },
  },
});

export const { setNotifsUnread, setMessagesUnread } = indicatorsSlice.actions;
export default indicatorsSlice.reducer;
