import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import cloudsReducer from 'reducers/clouds';
import userReducer from 'reducers/user';

export const store = configureStore({
  reducer: {
    clouds: cloudsReducer,
    user: userReducer
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
