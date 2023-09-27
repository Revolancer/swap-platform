import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Notification } from '../types';
import { axiosPrivate } from '../axios';
import { DateTime } from 'luxon';

interface IndicatorsState {
  notifs: Notification[];
  messages: Message[];
}

const initialState = {
  notifs: [],
  messages: [],
} as IndicatorsState;

export const getNotifications = createAsyncThunk('notifications', async () => {
  const res = await axiosPrivate.get('notifications');
  return res.data;
});

export const markNotifAsRead = createAsyncThunk(
  'notifications/acknowledge/:id',
  async (id: string) => {
    await axiosPrivate.post(`notifications/acknowledge/${id}`);
    return id;
  },
);

export const getMessages = createAsyncThunk('message', async () => {
  const res = await axiosPrivate.get('message', {
    id: `message-threads`,
    cache: {
      ttl: 20 * 1000,
    },
  });
  return res.data;
});

export const markMessageAsRead = createAsyncThunk(
  'message/acknowledge/:id',
  async (id: string) => {
    await axiosPrivate.post(`message/acknowledge/${id}`);
    return id;
  },
);

export const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.notifs = action.payload.filter((notif) => notif.read == true);
        },
      )
      .addCase(getNotifications.rejected, (state) => {
        state.notifs = [];
      })
      .addCase(
        markNotifAsRead.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.notifs.filter((notif) => notif.id == action.payload);
        },
      )
      .addCase(markNotifAsRead.rejected, () => {})
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.messages = action.payload;
        },
      )
      .addCase(getMessages.rejected, (state) => {
        state.messages = [];
      })
      .addCase(
        markMessageAsRead.fulfilled,
        (state, action: PayloadAction<string>) => {
          const messageOnRead = state.messages.findIndex(
            (message) => message.id == action.payload,
          );
          state.messages[messageOnRead].read = true;
          state.messages[messageOnRead].read_at = DateTime.now()
            .toJSDate()
            .toString();
        },
      )
      .addCase(markMessageAsRead.rejected, () => {});
  },
});
