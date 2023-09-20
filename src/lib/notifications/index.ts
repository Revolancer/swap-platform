import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Notification } from '../types';
import { axiosPrivate } from '../axios';

interface IndicatorsState {
  notifsUnread: number;
  notifs: Notification[];
  messagesUnread: number;
  messages: Message[];
}

const initialState = {
  notifsUnread: 0,
  notifs: [],
  messagesUnread: 0,
  messages: [],
} as IndicatorsState;

export const getNotifications = createAsyncThunk('notifications', async () => {
  const res = await axiosPrivate.get('notifications');
  return res.data;
});

export const getMessages = createAsyncThunk('message', async () => {
  const res = await axiosPrivate.get('message', {
    id: `message-threads`,
    cache: {
      ttl: 20 * 1000,
    },
  });
  return res.data;
});

export const indicatorsSlice = createSlice({
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
  extraReducers: (builder) => {
    builder
      .addCase(
        getNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.notifs = action.payload;
        },
      )
      .addCase(getNotifications.rejected, (state) => {
        state.notifs = [];
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.messages = action.payload;
        },
      )
      .addCase(getMessages.rejected, (state) => {
        state.messages = [];
      });
  },
});

export const { setNotifsUnread, setMessagesUnread } = indicatorsSlice.actions;
