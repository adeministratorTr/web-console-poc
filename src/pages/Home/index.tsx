import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchClouds } from 'reducers/clouds';
import Loading from 'components/Loading';
import { getDistanceFromLocations, TLocation } from 'utils/location';

export default function Home() {
  const dispatch = useAppDispatch();
  const initialCloudState = useAppSelector((state) => state.clouds);

  useEffect(() => {
    dispatch(fetchClouds());
    // navigator.geolocation.getCurrentPosition(locationSuccess); // @TODO: add error cb
  }, []);

  function locationSuccess(userLocation: GeolocationPosition) {
    const { latitude, longitude } = userLocation.coords;
    const location1: TLocation = {
      longitude,
      latitude
    };

    const location2: TLocation = {
      longitude: 18.42,
      latitude: -33.92
    };
    // @TODO remove console
    console.log('distance: ', getDistanceFromLocations({ location1, location2 }));
  }

  return (
    <div data-testid="Home">
      <h1>Home Page</h1>
      {initialCloudState.status === 'loading' && <Loading />}
      {initialCloudState.status === 'fail' && (
        <p data-testid="Error">Ooops. Something went wrong</p>
      )}
      {initialCloudState.status === 'success' && initialCloudState.clouds.length > 0 && (
        <p data-testid="List">{initialCloudState.clouds[0].cloud_description}</p>
      )}
    </div>
  );
}
