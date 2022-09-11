import { TLocation } from 'utils/location';
import { createMockStore } from 'utils/testUtils';
import cloudsReducer, {
  fetchClouds,
  getSelectedClouds,
  initialState,
  setProvider,
  setRegion,
  setUserLocation,
  TCloudState
} from './clouds';

const sampleClouds = [
  {
    cloud_description: 'Africa, South Africa - Amazon Web Services: Cape Town',
    cloud_name: 'aws-af-south-1',
    geo_latitude: 10,
    geo_longitude: -10,
    geo_region: 'africa'
  },
  {
    cloud_description: 'Europe, Germany - Google Cloud: Frankfurt',
    cloud_name: 'google-europe-west3',
    geo_latitude: -50,
    geo_longitude: -100,
    geo_region: 'europe'
  },
  {
    cloud_description: 'Europe, Ireland - Amazon Web Services: Ireland',
    cloud_name: 'aws-eu-west-1',
    geo_latitude: -50,
    geo_longitude: -100,
    geo_region: 'europe'
  },
  {
    cloud_description: 'Europe, UK - Amazon Web Services: London',
    cloud_name: 'aws-eu-west-2',
    geo_latitude: -10,
    geo_longitude: -10,
    geo_region: 'europe'
  }
];

const {
  reduxThunkTester: { getActionHistoryAsync, clearActionHistory },
  store
} = createMockStore();

beforeEach(() => clearActionHistory());
afterAll(() => clearActionHistory());

describe('reducers/clouds', () => {
  describe('api calls', () => {
    it('should return the initial state by default', () => {
      expect(cloudsReducer(undefined, { type: '' })).toEqual({
        ...initialState,
        status: 'loading',
        clouds: [],
        errors: [
          {
            message: '',
            more_info: '',
            status: 0
          }
        ],
        message: ''
      });
    });

    it('should start fetching', () => {
      expect(cloudsReducer(undefined, { type: fetchClouds.pending.toString() })).toEqual({
        ...initialState,
        status: 'loading'
      });
    });

    it('should set payload when fetched successfully', async () => {
      const expectedState = {
        ...initialState,
        status: 'success',
        clouds: sampleClouds,
        regions: ['africa', 'europe']
      };

      store.dispatch({ type: fetchClouds.fulfilled, payload: sampleClouds });

      expect(store.getState().clouds).toEqual(expectedState);
      expect(await getActionHistoryAsync()).toEqual([
        {
          type: fetchClouds.fulfilled,
          payload: sampleClouds
        }
      ]);
    });

    it('should show error', async () => {
      const errorMessage = 'No provider';
      const sampleError = {
        message: errorMessage
      };

      store.dispatch({
        type: fetchClouds.rejected,
        payload: errorMessage
      });

      const expectedState = {
        ...initialState,
        status: 'fail',
        regions: [],
        message: sampleError.message
      };

      expect(store.getState().clouds).toEqual(expectedState);
      expect(await getActionHistoryAsync()).toEqual([
        {
          type: fetchClouds.rejected,
          payload: errorMessage
        }
      ]);
    });
  });

  // Decided to separate tests of async api calls from global state manipulation
  describe('global state', () => {
    it('should set region list', () => {
      const regions = ['africa', 'europe'];

      // setRegionList is not exported function. thats why 'fetchClouds.fulfilled' used
      store.dispatch({ type: fetchClouds.fulfilled, payload: sampleClouds });
      expect(store.getState().clouds.regions).toEqual(regions);
    });

    it('should set selected region', () => {
      const sampleRegion = 'europe';
      expect(
        cloudsReducer(initialState, setRegion(sampleRegion)).selectedClouds.region
      ).toEqual(sampleRegion);
    });

    it('should set selected cloud provider', () => {
      const sampleProvider = 'aws';
      expect(
        cloudsReducer(initialState, setProvider(sampleProvider)).selectedClouds
          .cloudProvider
      ).toEqual(sampleProvider);
    });

    it('should return selected cloud providers', () => {
      expect(cloudsReducer(initialState, { type: '' }).selectedClouds.list.length).toBe(
        0
      );

      const sampleRegion = 'europe';
      const sampleProvider = 'aws';
      const updatedState: TCloudState = {
        ...initialState,
        clouds: sampleClouds,
        regions: ['africa', 'europe'],
        selectedClouds: {
          cloudProvider: sampleProvider,
          region: sampleRegion,
          list: []
        }
      };

      expect(
        cloudsReducer(updatedState, getSelectedClouds()).selectedClouds.list.length
      ).toBe(2);
      expect(
        cloudsReducer(updatedState, getSelectedClouds()).selectedClouds.list
      ).toEqual([sampleClouds[2], sampleClouds[3]]);
    });

    it('should set user location info and list by distance', () => {
      const sampleLocation: TLocation = {
        latitude: 10,
        longitude: -10
      };

      store.dispatch({ type: fetchClouds.fulfilled, payload: sampleClouds });
      store.dispatch({ type: setUserLocation.toString(), payload: sampleLocation });
      store.dispatch({ type: setProvider.toString(), payload: 'aws' });
      store.dispatch({ type: setRegion.toString(), payload: 'europe' });

      expect(store.getState().clouds.selectedClouds.list).toEqual([
        sampleClouds[3],
        sampleClouds[2]
      ]);
    });
  });
});
