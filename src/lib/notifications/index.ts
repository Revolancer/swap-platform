import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Notification } from '../types';
import { axiosPrivate } from '../axios';

interface IndicatorsState {
  notifsUnread: number;
  notifs: Notification[];
  messagesUnread: number;
  messageCount: number;
  messages: Message[];
}

const initialState = {
  notifsUnread: 0,
  notifs: [],
  messagesUnread: 0,
  messageCount: 0,
  messages: [],
} as IndicatorsState;

export const getNotifications = createAsyncThunk('notifications', async () => {
  const res = await axiosPrivate.get('notifications');
  return res.data;
});

export const getUnreadNotifsCount = createAsyncThunk(
  'notifications/count/unread',
  async () => {
    const res = axiosPrivate.get('notifications/count/unread');
    return (await res).data;
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

export const getUnreadMessagesCount = createAsyncThunk(
  'message/unread',
  async () => {
    const res = await axiosPrivate.get('message/unread');
    return res.data;
  },
);

export const getAllMessagesCount = createAsyncThunk(
  'message/count_all',
  async () => {
    const res = await axiosPrivate.get('message/count_all');
    return res.data;
  },
);

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
        getUnreadNotifsCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.notifsUnread = action.payload;
        },
      )
      .addCase(getUnreadNotifsCount.rejected, (state) => {
        state.notifsUnread = 0;
      })
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
        getUnreadMessagesCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.messagesUnread = action.payload;
        },
      )
      .addCase(getUnreadMessagesCount.rejected, (state) => {
        state.messagesUnread = 0;
      })
      .addCase(
        getAllMessagesCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.messageCount = action.payload;
        },
      )
      .addCase(getAllMessagesCount.rejected, (state) => {
        state.messageCount = 0;
      });
  },
});

export const { setNotifsUnread, setMessagesUnread } = indicatorsSlice.actions;
