import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'app/store';
import Home from './index';

describe('pages/Home', () => {
  it('should render default', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('Home')).toBeVisible();
  });
});
