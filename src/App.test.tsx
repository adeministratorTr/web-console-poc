import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

test('renders learn react link', () => {
  render(
    // @TODO: Update test when there is new/valid store
    // <Provider store={store}>
    <App />
    // </Provider>
  );

  expect(screen.getByTestId('App')).toBeVisible();
});
