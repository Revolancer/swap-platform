import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Notification } from '../types';
import { axiosPrivate } from '../axios';

interface IndicatorsState {
  notifications: Notification[];
  notifsUnread: number;
  messages: Message[];
  messagesUnread: number;
}

const initialState = {
  notifications: [],
  notifsUnread: 0,
  messages: [],
  messagesUnread: 0,
} as IndicatorsState;

export const getNotifications = createAsyncThunk('notifications', async () => {
  return await axiosPrivate
    .get('notifications', {
      cache: { ttl: 1000 },
    })
    .then((res) => res.data);
});

export const getNotificationsUnread = createAsyncThunk(
  'notifications/count/unread',
  async () => {
    return await axiosPrivate
      .get('notifications/count/unread', {
        cache: { ttl: 1000 },
      })
      .then((res) => res.data);
  },
);

export const setNotifRead = createAsyncThunk(
  'notifications/acknowledge/:id',
  async (id: string) =>
    await axiosPrivate.post(`notifications/acknowledge/${id}`),
);

export const getMessages = createAsyncThunk('messages', async (id?: string) => {
  if (id) {
    return await axiosPrivate
      .get(`message/admin/${id}`, {
        id: `message-threads`,
        cache: { ttl: 1000 },
      })
      .then((res) => res.data);
  }
  return await axiosPrivate
    .get('message', {
      id: `message-threads`,
      cache: { ttl: 1000 },
    })
    .then((res) => res.data);
});

export const getMessagesUnread = createAsyncThunk(
  'messages/count/unread',
  async () => {
    return await axiosPrivate
      .get('message/unread', {
        id: 'unread-message-count',
        cache: { ttl: 1000 },
      })
      .then((res) => res.data);
  },
);

export const setMessageRead = createAsyncThunk(
  'message/acknowledge/:id',
  async (id: string) => await axiosPrivate.post(`message/acknowledge/${id}`),
);

export const setAllMessagesRead = createAsyncThunk(
  'message/acknowledge',
  async () => await axiosPrivate.post(`message/acknowledge`),
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
    setMessagesUnread(state, action: PayloadAction<number | 'inc' | 'dec'>) {
      switch (action.payload) {
        case 'inc':
          state.messagesUnread++;
          break;
        case 'dec':
          if (state.messagesUnread == 0) break;
          state.messagesUnread--;
          break;
        default:
          state.messagesUnread = action.payload;
          break;
      }
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
        getNotificationsUnread.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.notifsUnread = action.payload;
        },
      )
      .addCase(getNotificationsUnread.rejected, (state) => {
        state.notifsUnread = 0;
      })
      .addCase(setNotifRead.fulfilled, () => {})
      .addCase(setNotifRead.rejected, () => {})
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
        getMessagesUnread.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.messagesUnread = action.payload;
        },
      )
      .addCase(getMessagesUnread.rejected, (state) => {
        state.messagesUnread = 0;
      })
      .addCase(setMessageRead.fulfilled, () => {})
      .addCase(setMessageRead.rejected, () => {})
      .addCase(setAllMessagesRead.fulfilled, () => {})
      .addCase(setAllMessagesRead.rejected, () => {});
  },
});

export const { setNotifsUnread, setMessagesUnread } = indicatorsSlice.actions;
export default indicatorsSlice.reducer;
