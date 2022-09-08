import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCloudPlatforms, TCloudPlatforms, TCloud } from 'services/clouds';

// Action
export const fetchClouds = createAsyncThunk(
  'clouds/fetch',
  async (_, { rejectWithValue }) => {
    let result;
    try {
      result = await getCloudPlatforms();
      if (result.message) {
        return rejectWithValue(result.message);
      } else if (result.errors && result.errors?.length > 0) {
        return rejectWithValue(result.errors[0]);
      } else return result.clouds;
    } catch (err) {
      const error = result?.message ?? err;
      return rejectWithValue(error);
    }
  }
);
// Action Ends

// Reducer
export type TCloudState = TCloudPlatforms & {
  status: 'loading' | 'success' | 'fail';
};

const initialState: TCloudState = {
  status: 'loading',
  clouds: [],
  errors: [
    {
      message: '',
      more_info: '',
      status: 0
    }
  ],
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
        if (state.message) delete state.message;
      })
      .addCase(fetchClouds.fulfilled, (state, action: PayloadAction<TCloud[]>) => {
        state.status = 'success';
        state.clouds = action.payload;
      })
      .addCase(fetchClouds.rejected, (state, action) => {
        state.status = 'fail';
        state.clouds = [];
        if (action.payload) state.message = String(action.payload);
      })
      .addDefaultCase((state) => {
        state.status = 'loading';
        state.clouds = [];
        delete state.message;
      });
  }
});

export default clouds.reducer;
