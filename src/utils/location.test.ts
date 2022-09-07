import { getDistanceFromLocations, TLocation } from './location';

describe('utils/location', () => {
  describe('getDistanceFromLocations', () => {
    const sampleLocation1: TLocation = {
      latitude: 10,
      longitude: 20
    };

    it('should return distance between 2 points', () => {
      const sampleLocation2: TLocation = {
        latitude: -100,
        longitude: -200
      };
      const result = getDistanceFromLocations({
        location1: sampleLocation1,
        location2: sampleLocation2
      });
      expect(result).toBe(245.9675);
    });

    it('should return 0 when both points are same', () => {
      const result = getDistanceFromLocations({
        location1: sampleLocation1,
        location2: sampleLocation1
      });

      expect(result).toBe(0);
    });
  });
});
