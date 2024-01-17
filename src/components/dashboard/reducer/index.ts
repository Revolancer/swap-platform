import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters, Order, Sort, SortType, Tag } from '../../../lib/types';
import { axiosPublic } from '@/lib/axios';

export interface FeedState {
  term: string;
  sort: Sort;
  order: Order;
  datatype: Filters;
  tag: Tag[];
  page: number;
}

const initialState = {
  term: '',
  sort: 'created',
  order: 'DESC',
  datatype: ['portfolio', 'need'],
  tag: [],
  page: 1,
} as FeedState;

export const setTag = createAsyncThunk(
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
    addTag(state, action: PayloadAction<Tag>) {
      state.tag.push(action.payload);
    },
    removeTag(state, action: PayloadAction<string>) {
      state.tag = state.tag.filter((tag) => tag.id !== action.payload);
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
    removeFilter(state, action: PayloadAction<'portfolio' | 'need' | 'user'>) {
      state.datatype = state.datatype?.filter(
        (item) => item !== action.payload,
      );
    },
    clearFilters(state) {
      state.datatype = [];
    },
    nextPage(state) {
      state.page++;
    },
    resetField(state, action: PayloadAction<string>) {
      switch (action.payload) {
        case 'term':
          state.term = initialState.term;
          if (state.datatype?.includes('user'))
            state.datatype = state.datatype.filter((type) => type !== 'user');
          break;
        case 'sort':
          state.sort = initialState.sort;
          break;
        case 'datatype':
          state.datatype = initialState.datatype;
          break;
        case 'order':
          state.order = initialState.order;
          break;
        case 'tag':
          state.tag = initialState.tag;
          if (state.datatype?.includes('user'))
            state.datatype = state.datatype.filter((type) => type !== 'user');
          break;
        case 'page':
          state.page = 1;
          break;
      }
    },
    resetFilters: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.tag.push(action.payload);
      })
      .addCase(setTag.rejected, () => {});
  },
});

export const {
  setTerm,
  addTag,
  removeTag,
  setSort,
  setFilters,
  removeFilter,
  clearFilters,
  nextPage,
  resetField,
  resetFilters,
} = feedSlice.actions;
export const feedInitialState = feedSlice.getInitialState();
export default feedSlice.reducer;
