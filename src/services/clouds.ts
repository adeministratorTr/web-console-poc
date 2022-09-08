const API_URL = process.env.REACT_APP_API_URL;
const API_VERSION = process.env.REACT_APP_API_VERSION;

export type TCloud = {
  cloud_description: string;
  cloud_name: string;
  geo_latitude: number;
  geo_longitude: number;
  geo_region: string;
};

export type TCloudPlatforms = {
  clouds: TCloud[];
  errors?: [
    {
      message: string;
      more_info?: string;
      status?: number;
    }
  ];
  message?: string;
};

export async function getCloudPlatforms(): Promise<TCloudPlatforms> {
  try {
    const response: TCloudPlatforms = await fetch(`${API_URL}/${API_VERSION}/clouds`)
      .then((result) => result.json())
      .then((resp) => resp)
      .catch((err) => err);

    return response;
  } catch (e) {
    throw new Error(String(e)); // it should be logged in real life
  }
}
