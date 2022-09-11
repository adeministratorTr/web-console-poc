import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { fetchClouds, setUserLocation } from 'reducers/clouds';
import { createMockStore, mockNavigatorGeolocation } from 'utils/testUtils';

import Home from './index';

const {
  reduxThunkTester: { clearActionHistory },
  store
} = createMockStore();

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
    geo_latitude: 150,
    geo_longitude: 200,
    geo_region: 'africa'
  },
  {
    cloud_description: 'Africa, North Africa - Azure: North Africa North',
    cloud_name: 'azure-north-africa-north',
    geo_latitude: -50,
    geo_longitude: -100,
    geo_region: 'africa'
  }
];

const sampleUserCoordinates = {
  latitude: -100,
  longitude: -100
};

beforeEach(() => {
  const { getCurrentPositionMock } = mockNavigatorGeolocation();
  getCurrentPositionMock.mockImplementation((success) => {
    success({
      coords: sampleUserCoordinates
    });
  });

  render(
    <Provider store={store}>
      <Home />
    </Provider>
  );

  clearActionHistory();
});
afterAll(() => clearActionHistory());

describe('pages/Home', () => {
  it('should render default', async () => {
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
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: [] });

    // user should see Loading component until action dispatched
    expect(screen.getByTestId('Loading')).toBeVisible();

    // when action dispatched successfully, user should not see any Loading component,
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('Home')).toBeVisible();
    expect(screen.queryByTestId('HomeCloudList')).toBeNull();
    expect(screen.queryByTestId('HomeRegions')).toBeNull();
  });

  it('should set selected cloud provider', async () => {
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
    expect(screen.queryByTestId('HomeCloudList')).toBeNull();
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    const homeRegionsComponent = screen.getByTestId('HomeRegions');

    expect(homeRegionsComponent).toBeVisible();

    const regionListComponent = screen.getByTestId('HomeRegionList');
    expect(regionListComponent).toBeVisible();

    const sampleRegion = regionListComponent.firstChild?.textContent as string;
    fireEvent.click(screen.getByText(sampleRegion));
    expect(homeRegionsComponent).toHaveTextContent(sampleRegion);
    expect(screen.getByTestId('HomeCloudList')).toBeVisible();
  });

  it('should show no result when cloud provider doesnt have option for selected region', async () => {
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));

    fireEvent.click(screen.getByText('UpCloud'));
    fireEvent.click(screen.getByText('africa'));
    expect(screen.queryByTestId('HomeCloudList')).toBeNull();
  });

  it('should show no result when error occurs on request', async () => {
    const sampleError = 'Error occurred on fetch';

    store.dispatch({ type: fetchClouds.rejected.toString(), payload: sampleError });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    expect(screen.getByTestId('Error')).toBeVisible();
    expect(screen.queryByTestId('HomeCloudList')).toBeNull();
    expect(screen.queryByTestId('HomeRegions')).toBeNull();
  });

  it('should list cloud providers by distance', async () => {
    store.dispatch({ type: fetchClouds.fulfilled.toString(), payload: sampleClouds });
    await waitForElementToBeRemoved(screen.getByTestId('Loading'));
    fireEvent.click(screen.getByText('Azure'));
    fireEvent.click(screen.getByText('africa'));
    store.dispatch({ type: setUserLocation.toString(), payload: sampleUserCoordinates });

    expect(screen.getAllByTestId('HomeCloudItem')[0]).toHaveTextContent(
      sampleClouds[2].cloud_name
    );
    expect(screen.getAllByTestId('HomeCloudItem')[1]).toHaveTextContent(
      sampleClouds[1].cloud_name
    );
  });
});
