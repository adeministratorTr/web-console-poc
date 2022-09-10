import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TLocation } from 'utils/location';

type TUserLocation = {
  location: TLocation;
};

export const initialState: TUserLocation = {
  location: {
    latitude: 0,
    longitude: 0
  }
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<TLocation>) => {
      state.location.latitude = action.payload.latitude;
      state.location.longitude = action.payload.longitude;
    }
  }
});
export const { setLocation } = user.actions;

export default user.reducer;
