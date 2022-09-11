import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import cloudsReducer from 'reducers/clouds';

export const store = configureStore({
  reducer: {
    clouds: cloudsReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
