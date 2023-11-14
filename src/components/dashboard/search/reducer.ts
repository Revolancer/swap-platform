import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters, Order, Sort, SortType, Tag } from '../../../lib/types';
import { axiosPublic } from '@/lib/axios';

interface FeedState {
  term: string;
  sort: Sort;
  order: Order;
  datatype: Filters;
  tags: Tag[];
  page: number;
}

const initialState = {
  term: '',
  sort: 'created',
  order: 'DESC',
  datatype: ['portfolios', 'needs'],
  tags: [],
  page: 1,
} as FeedState;

export const addTag = createAsyncThunk(
  'tags/:id',
  async (id: string) =>
    await axiosPublic.get(`tags/${id}`).then((res) => res.data),
);

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
    removeTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((tag: Tag) => tag.id !== action.payload);
    },
    clearTags(state) {
      state.tags = [];
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
  extraReducers: (builder) => {
    builder
      .addCase(addTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.tags.push(action.payload);
      })
      .addCase(addTag.rejected, () => {});
  },
});

export const {
  setTerm,
  clearTerm,
  removeTag,
  clearTags,
  setSort,
  setFilters,
  clearFilters,
  nextPage,
} = feedSlice.actions;
export const feedInitialState = feedSlice.getInitialState();
export default feedSlice.reducer;
