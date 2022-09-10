import { getCloudPlatforms, TCloudPlatforms } from './clouds';

describe('services/clouds', () => {
  const sampleData: TCloudPlatforms = {
    clouds: [
      {
        cloud_description: 'Africa, South Africa - Amazon Web Services: Cape Town',
        cloud_name: 'aws-af-south-1',
        geo_latitude: -33.92,
        geo_longitude: 18.42,
        geo_region: 'africa'
      },
      {
        cloud_description: 'Africa, South Africa - Azure: South Africa North',
        cloud_name: 'azure-south-africa-north',
        geo_latitude: -26.198,
        geo_longitude: 28.03,
        geo_region: 'africa'
      },
      {
        cloud_description: 'Asia, Bahrain - Amazon Web Services: Bahrain',
        cloud_name: 'aws-me-south-1',
        geo_latitude: 26.07,
        geo_longitude: 50.55,
        geo_region: 'south asia'
      }
    ]
  };

  it('should return sample data', () => {
    const response = { json: jest.fn().mockResolvedValueOnce(sampleData) };
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    getCloudPlatforms().then((response) => {
      expect(response).toEqual(sampleData);
      expect(sampleData.clouds).toHaveLength(sampleData.clouds.length);
      response.clouds.map((item) => {
        expect(item).toHaveProperty('cloud_description');
        expect(item).toHaveProperty('cloud_name');
        expect(item).toHaveProperty('geo_latitude');
        expect(item).toHaveProperty('geo_longitude');
        expect(item).toHaveProperty('geo_region');
      });
    });
  });

  it('should throw error on reject', async () => {
    const mockErrorMessage = 'Error message';
    const mockFetch = Promise.reject(mockErrorMessage);

    await expect(mockFetch).rejects.toEqual(mockErrorMessage);
  });
});
