import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters, Order, Sort, SortType } from '../../../lib/types';

interface FeedState {
  term: string;
  sort: Sort;
  order: Order;
  datatype: Filters;
  page: number;
}

const initialState = {
  term: '',
  sort: 'created',
  order: 'DESC',
  datatype: ['portfolios', 'needs'],
  page: 1,
} as FeedState;

const feedSlice = createSlice({
  name: 'feedFilters',
  initialState,
  reducers: {
    setTerm(state, action: PayloadAction<string>) {
      state.term = action.payload;
    },
    clearTerm(state) {
      state.term = '';
    },
    setSort(state, action: PayloadAction<SortType>) {
      switch (action.payload) {
        case 'newest': {
          state.sort = 'created';
          state.order = 'DESC';
          break;
        }
        case 'oldest': {
          state.sort = 'created';
          state.order = 'ASC';
          break;
        }
        case 'relevance': {
          state.sort = 'relevance';
          state.order = 'DESC';
          break;
        }
      }
    },
    setFilters(state, action: PayloadAction<Filters>) {
      state.datatype = action.payload;
    },
    clearFilters(state) {
      state.datatype = [];
    },
    nextPage(state) {
      state.page++;
    },
  },
});

export const {
  setTerm,
  clearTerm,
  setSort,
  setFilters,
  clearFilters,
  nextPage,
} = feedSlice.actions;
export default feedSlice.reducer;
