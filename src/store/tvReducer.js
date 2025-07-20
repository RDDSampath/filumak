import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import Api from '../Api/Api';

export const fetchTv = createAsyncThunk('getTv', async (page = 1) => {
  const response = await Api.getTv(page);
  return response;
});

const tvSlice = createSlice({
  name: 'tv',
  initialState: {
    data: null,
    currentPage: 1,
    totalPages: 1,
    isLoader: false,
    isError: false,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTv.pending, state => {
        state.isLoader = true;
        state.isError = false;
      })
      .addCase(fetchTv.fulfilled, (state, action) => {
        state.isLoader = false;
        state.data = action.payload;
        state.currentPage = action.payload?.page || 1;
        state.totalPages = action.payload?.total_pages || 1;
      })
      .addCase(fetchTv.rejected, state => {
        state.isLoader = false;
        state.isError = true;
      });
  },
});

export default tvSlice.reducer;
