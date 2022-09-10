import { TLocation } from 'utils/location';
import userReducer, { initialState, setLocation } from './user';

describe('reducers/user', () => {
  it('should return initial state by default', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should set location info', () => {
    const sampleLocation: TLocation = {
      latitude: 10,
      longitude: -10
    };
    const expectedState = {
      location: {
        latitude: 10,
        longitude: -10
      }
    };
    expect(userReducer(initialState, setLocation(sampleLocation))).toEqual(expectedState);
  });
});
