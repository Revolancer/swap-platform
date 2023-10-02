import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../types';
import { axiosPrivate } from '../axios';

interface IndicatorsState {
  notifications: Notification[];
  notifsUnread: number;
  messagesUnread: number;
}

const initialState = {
  notifications: [],
  notifsUnread: 0,
  messagesUnread: 0,
} as IndicatorsState;

export const getNotifications = createAsyncThunk('notifications', async () => {
  return await axiosPrivate.get('notifications').then((res) => res.data);
});

export const setNotifRead = createAsyncThunk(
  'notifications/acknowledge/:id',
  async (id: string) => {
    return await axiosPrivate
      .post(`notifications/acknowledge/${id}`)
      .then((res) => res.data);
  },
);

const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    setNotifsUnread(state, action: PayloadAction<number | 'inc' | 'dec'>) {
      switch (action.payload) {
        case 'inc':
          state.notifsUnread++;
          break;
        case 'dec':
          if (state.notifsUnread == 0) break;
          state.notifsUnread--;
          break;
        default:
          state.notifsUnread = action.payload;
          break;
      }
    },
    setMessagesUnread(state, action: PayloadAction<number>) {
      state.messagesUnread = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.notifications = action.payload;
        },
      )
      .addCase(getNotifications.rejected, (state) => {
        state.notifications = [];
      })
      .addCase(
        setNotifRead.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          console.log(action.payload);
          state.notifications = action.payload;
        },
      )
      .addCase(setNotifRead.rejected, (state) => {
        state.notifications = [];
      });
  },
});

export const { setNotifsUnread, setMessagesUnread } = indicatorsSlice.actions;
export default indicatorsSlice.reducer;
