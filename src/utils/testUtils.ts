import { applyMiddleware, combineReducers, configureStore } from '@reduxjs/toolkit';
import ReduxThunkTester from 'redux-thunk-tester';

import cloudsReducer from 'reducers/clouds';

export const createMockStore = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = configureStore({
    reducer: combineReducers({ clouds: cloudsReducer }),
    enhancers: [applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware())]
  });

  return { reduxThunkTester, store };
};

export const mockNavigatorGeolocation = () => {
  const clearWatchMock = jest.fn();
  const getCurrentPositionMock = jest.fn();
  const watchPositionMock = jest.fn();

  const geolocation = {
    clearWatch: clearWatchMock,
    getCurrentPosition: getCurrentPositionMock,
    watchPosition: watchPositionMock
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocation,
    writable: true
  });

  return { getCurrentPositionMock };
};
