import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieReducer';
import tvReducer from './tvReducer';


export const store = configureStore({
  reducer: {
    movie: movieReducer,
    tv: tvReducer,

  },
})