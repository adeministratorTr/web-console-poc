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
