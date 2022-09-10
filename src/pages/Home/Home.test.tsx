import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import { fetchClouds } from 'reducers/clouds';
import { createMockStore } from 'utils/testUtils';

import Home from './index';

const {
  reduxThunkTester: { clearActionHistory },
  store
} = createMockStore();

beforeEach(() => clearActionHistory());

const sampleClouds = [
  {
    cloud_description: 'Africa, South Africa - Amazon Web Services: Cape Town',
    cloud_name: 'aws-af-south-1',
    geo_latitude: 10,
    geo_longitude: -10,
    geo_region: 'africa'
  },
  {
    cloud_description: 'Africa, South Africa - Azure: South Africa North',
    cloud_name: 'azure-south-africa-north',
    geo_latitude: -50,
    geo_longitude: -100,
    geo_region: 'africa'
  }
];

describe('pages/Home', () => {
  it('should render default', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });

    // user should see Loading component until action dispatched
    expect(screen.getByTestId('Loading')).toBeVisible();

    // when action dispatched successfully, user should not see any Loading component,
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('Home')).toBeVisible();
    expect(screen.queryByTestId('Error')).not.toBeInTheDocument();
  });
});
