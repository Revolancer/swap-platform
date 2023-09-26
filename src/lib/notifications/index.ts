import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Notification } from '../types';
import { axiosPrivate } from '../axios';
import { DateTime } from 'luxon';

interface IndicatorsState {
  notifs: Notification[];
  messagesUnread: number;
  messageCount: number;
  messages: Message[];
}

const initialState = {
  notifs: [],
  messagesUnread: 0,
  messageCount: 0,
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
    getNotifications();
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

export const markMessageAsRead = createAsyncThunk(
  'message/acknowledge/:id',
  async (id: string) => {
    await axiosPrivate.post(`message/acknowledge/${id}`);
    getMessages();
    getUnreadMessagesCount();
    return id;
  },
);

export const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    setMessagesUnread(state, action: PayloadAction<number>) {
      state.messagesUnread = action.payload;
    },
  },
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
          getNotifications();
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
          getMessages();
          getAllMessagesCount();
          getUnreadMessagesCount();
          console.log('messagesUnread: ', state.messagesUnread);
        },
      )
      .addCase(markMessageAsRead.rejected, () => {});
  },
});

export const { setMessagesUnread } = indicatorsSlice.actions;
