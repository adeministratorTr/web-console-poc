import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCloudPlatforms, TCloudPlatforms, TCloud } from 'services/clouds';
import { TCloudProviderValues } from 'reducers/constants/cloud';

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
  regions: string[];
  selectedClouds: {
    cloudProvider: TCloudProviderValues | '';
    region: string;
    list: TCloud[];
  };
};

export const initialState: TCloudState = {
  status: 'loading',
  regions: [],
  selectedClouds: {
    cloudProvider: '',
    region: '',
    list: []
  },
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
  reducers: {
    setRegionList: (state) => {
      const regions = state.clouds.map((cloud) => cloud.geo_region);
      const uniqueRegions = new Set([...regions]);
      state.regions = Array.from(uniqueRegions);
    },
    setRegion: (state, action) => {
      state.selectedClouds.region = action.payload;
      clouds.caseReducers.getSelectedClouds(state);
    },
    setProvider: (state, action: PayloadAction<TCloudProviderValues>) => {
      state.selectedClouds.cloudProvider = action.payload;
      clouds.caseReducers.getSelectedClouds(state);
    },
    getSelectedClouds: (state) => {
      if (state.selectedClouds.region && state.selectedClouds.cloudProvider) {
        state.selectedClouds.list = state.clouds
          .filter((cloud) => cloud.geo_region === state.selectedClouds.region)
          .filter((cloud) =>
            cloud.cloud_name.includes(state.selectedClouds.cloudProvider)
          );
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClouds.pending, (state) => {
        state.status = 'loading';
        if (state.message) state.message = '';
      })
      .addCase(fetchClouds.fulfilled, (state, action: PayloadAction<TCloud[]>) => {
        state.status = 'success';
        state.clouds = action.payload;
        clouds.caseReducers.setRegionList(state);
      })
      .addCase(fetchClouds.rejected, (state, action) => {
        state.status = 'fail';
        state.clouds = [];
        state.regions = [];
        if (action.payload) state.message = String(action.payload);
      })
      .addDefaultCase((state) => {
        state.status = 'loading';
        state.clouds = [];
        state.message = '';
      });
  }
});

export const { getSelectedClouds, setRegion, setProvider } = clouds.actions;

export default clouds.reducer;
