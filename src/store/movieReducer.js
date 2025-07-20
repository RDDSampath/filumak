import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import Api from '../Api/Api';

export const fetchMovie = createAsyncThunk('getMovie', async (page = 1) => {
  const response = await Api.getMovie(page);
  return response;
});

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    data: null,
    currentPage: 1,
    totalPages: 1,
    isLoader: false,
    isError: false,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovie.pending, state => {
        state.isLoader = true;
        state.isError = false;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.isLoader = false;
        state.data = action.payload;
        state.currentPage = action.payload?.page || 1;
        state.totalPages = action.payload?.total_pages || 1;
      })
      .addCase(fetchMovie.rejected, state => {
        state.isLoader = false;
        state.isError = true;
      });
  },
});

export default movieSlice.reducer;
