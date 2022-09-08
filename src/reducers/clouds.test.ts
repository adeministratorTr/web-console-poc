import { createMockStore } from 'utils/testUtils';
import cloudsReducer, { fetchClouds } from './clouds';

const initialState = {
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
};

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

const {
  reduxThunkTester: { getActionHistoryAsync, clearActionHistory },
  store
} = createMockStore();

beforeEach(() => clearActionHistory());

describe('reducers/clouds', () => {
  it('should return the initial state by default', () => {
    expect(cloudsReducer(undefined, { type: '' })).toEqual({
      status: 'loading',
      clouds: [],
      errors: [
        {
          message: '',
          more_info: '',
          status: 0
        }
      ]
    });
  });

  it('should start fetching', () => {
    expect(cloudsReducer(undefined, { type: fetchClouds.pending.toString() })).toEqual(
      initialState
    );
  });

  it('should set payload when fetched successfully', async () => {
    const expectedState = {
      status: 'success',
      clouds: sampleClouds,
      errors: [
        {
          message: '',
          more_info: '',
          status: 0
        }
      ]
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
      status: 'fail',
      clouds: [],
      errors: [
        {
          message: '',
          more_info: '',
          status: 0
        }
      ],
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
