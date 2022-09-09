import { createMockStore } from 'utils/testUtils';
import cloudsReducer, { fetchClouds, initialState } from './clouds';

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
  }
];

const {
  reduxThunkTester: { getActionHistoryAsync, clearActionHistory },
  store
} = createMockStore();

beforeEach(() => clearActionHistory());
afterAll(() => clearActionHistory());

describe('reducers/clouds', () => {
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
