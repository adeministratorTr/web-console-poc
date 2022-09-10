import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { fetchClouds } from 'reducers/clouds';
import { createMockStore } from 'utils/testUtils';

import Home from './index';

const {
  reduxThunkTester: { clearActionHistory },
  store
} = createMockStore();

beforeEach(() => clearActionHistory());
afterAll(() => clearActionHistory());

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
    expect(screen.getByTestId('HomeCloudProviders')).toBeVisible();
    expect(screen.getByTestId('HomeRegions')).toBeVisible();
    expect(screen.queryByTestId('Error')).not.toBeInTheDocument();
  });

  it('should render no result when response has no data', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: [] });

    // user should see Loading component until action dispatched
    expect(screen.getByTestId('Loading')).toBeVisible();

    // when action dispatched successfully, user should not see any Loading component,
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('Home')).toBeVisible();
    expect(screen.queryByTestId('List')).toBeNull();
    expect(screen.queryByTestId('HomeRegions')).toBeNull();
  });

  it('should set selected cloud provider', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('HomeCloudProviders')).toBeVisible();
    const sampleCloudProvider = screen.getAllByTestId('HomeCloudProviderItem')[0]
      .textContent as string;

    fireEvent.click(screen.getByText(sampleCloudProvider));

    expect(screen.getByTestId('HomeCloudProviders')).toHaveTextContent(
      sampleCloudProvider
    );
    expect(screen.getByTestId('HomeCloudProviders')).not.toHaveTextContent('aws');
  });

  it('should set selected cloud region', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(screen.queryByTestId('List')).toBeNull();
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    const homeRegionsComponent = screen.getByTestId('HomeRegions');

    expect(homeRegionsComponent).toBeVisible();

    const regionListComponent = screen.getByTestId('HomeRegionList');
    expect(regionListComponent).toBeVisible();

    const sampleRegion = regionListComponent.firstChild?.textContent as string;
    fireEvent.click(screen.getByText(sampleRegion));
    expect(homeRegionsComponent).toHaveTextContent(sampleRegion);
    expect(screen.getByTestId('List')).toBeVisible();
  });

  it('should show no result when cloud provider doesnt have option for selected region', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));

    fireEvent.click(screen.getByText('UpCloud'));
    fireEvent.click(screen.getByText('africa'));
    expect(screen.queryByTestId('List')).toBeNull();
  });

  it('should show no result when error occurs on request', async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    const sampleError = 'Error occurred on fetch';

    store.dispatch({ type: fetchClouds.rejected.toString(), payload: sampleError });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('Error')).toBeVisible();
    expect(screen.queryByTestId('List')).toBeNull();
    expect(screen.queryByTestId('HomeRegions')).toBeNull();
  });
});
