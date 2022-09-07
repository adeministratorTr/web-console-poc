import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCloudPlatforms, TCloudPlatforms } from 'services/clouds';

// Action
export const fetchClouds = createAsyncThunk('clouds/fetch', async () => {
  const result = await getCloudPlatforms();
  return result.clouds;
});
// Action Ends

// Reducer
export type TCloudState = TCloudPlatforms & {
  status: 'loading' | 'success' | 'fail';
};

const initialState: TCloudState = {
  status: 'loading',
  clouds: [],
  error: {
    message: '',
    more_info: '',
    status: 0
  },
  message: ''
};

export const clouds = createSlice({
  name: 'clouds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClouds.pending, (state) => {
        state.status = 'loading';
        if (state.error) state.error.message = '';
      })
      .addCase(fetchClouds.fulfilled, (state, action) => {
        state.status = 'success';
        state.clouds = action.payload;
      })
      .addCase(fetchClouds.rejected, (state, action) => {
        state.status = 'fail';
        if (state.error) state.error.message = action.error.toString();
      })
      .addDefaultCase((state) => {
        state.status = 'loading';
      });
  }
});

export default clouds.reducer;
