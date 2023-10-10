import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreditLogEntry } from '../types';
import { axiosPrivate } from '../axios';

interface WalletState {
  credits: number;
  creditLog: CreditLogEntry[];
  reverseLog: CreditLogEntry[];
  loading: boolean;
}

const initialState = {
  credits: 0,
  creditLog: [],
  reverseLog: [],
  loading: true,
} as WalletState;

export const getCredits = createAsyncThunk('credits', async (id?: string) => {
  if (id) {
    return await axiosPrivate
      .get(`credits/admin/${id}`, { cache: { ttl: 5000 } })
      .then((res) => res.data);
  }
  return await axiosPrivate
    .get('credits', { cache: { ttl: 5000 } })
    .then((res) => res.data);
});

export const getCreditLogs = createAsyncThunk(
  'credits/log',
  async (id?: string) => {
    if (id) {
      return await axiosPrivate
        .get(`credits/admin/${id}/log`, { cache: { ttl: 5000 } })
        .then((response) => response.data);
    }
    return await axiosPrivate
      .get('credits/log', { cache: { ttl: 5000 } })
      .then((res) => res.data);
  },
);

export const getReverseCreditLogs = createAsyncThunk(
  'credits/log/reverse',
  async (id?: string) => {
    if (id) {
      return await axiosPrivate
        .get(`credits/admin/${id}/log/reverse`, { cache: { ttl: 5000 } })
        .then((response) => response.data);
    }
    return await axiosPrivate
      .get('credits/log/reverse', { cache: { ttl: 5000 } })
      .then((res) => res.data);
  },
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCredits.fulfilled, (state, action: PayloadAction<number>) => {
        state.credits = action.payload;
        state.loading = false;
      })
      .addCase(getCredits.rejected, (state) => {
        state.credits = 0;
        state.loading = false;
      })
      .addCase(
        getCreditLogs.fulfilled,
        (state, action: PayloadAction<CreditLogEntry[]>) => {
          state.creditLog = action.payload;
          state.loading = false;
        },
      )
      .addCase(getCreditLogs.rejected, (state) => {
        state.creditLog = [];
        state.loading = false;
      })
      .addCase(
        getReverseCreditLogs.fulfilled,
        (state, action: PayloadAction<CreditLogEntry[]>) => {
          state.reverseLog = action.payload;
          state.loading = false;
        },
      )
      .addCase(getReverseCreditLogs.rejected, (state) => {
        state.reverseLog = [];
        state.loading = false;
      });
  },
});
