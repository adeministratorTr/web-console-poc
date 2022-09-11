import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchClouds, setRegion, setProvider, setUserLocation } from 'reducers/clouds';
import Loading from 'components/Loading';
import CloudProvider from './components/CloudProvider';
import { cloudProviderMapper, TCloudProviderValues } from 'reducers/constants/cloud';
import NoResult from 'components/NoResult';

import styles from './Home.module.scss';

export default function Home() {
  const dispatch = useAppDispatch();
  const initialCloudState = useAppSelector((state) => state.clouds);
  const userLocation = useAppSelector((state) => state.clouds.userLocation);

  useEffect(() => {
    dispatch(fetchClouds());
    navigator.geolocation.getCurrentPosition(locationPermissionOnSuccess);
  }, []);

  function shouldHideCloudProviders(): boolean {
    return (
      initialCloudState.selectedClouds.list.length === 0 &&
      initialCloudState.selectedClouds.cloudProvider.length !== 0 &&
      initialCloudState.selectedClouds.region.length !== 0
    );
  }

  function locationPermissionOnSuccess(userLocation: GeolocationPosition) {
    dispatch(
      setUserLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.latitude
      })
    );
  }

  // Render functions
  const renderSelectedRegionClouds = () => (
    <div data-testid="HomeCloudList">
      {initialCloudState.selectedClouds.list.map((cloud, index) => (
        <div key={index} className={styles.cloudItem} data-testid="HomeCloudItem">
          <p>{cloud.cloud_name}</p>
          <p>Location: {cloud.cloud_description}</p>
        </div>
      ))}
    </div>
  );

  const renderListRegions = () => (
    <div className={styles.regionContainer} data-testid="HomeRegionList">
      {initialCloudState.regions.map((region, index) => (
        <p
          className={styles.regionItem}
          key={index}
          onClick={() => dispatch(setRegion(region))}
          data-testid="HomeRegionItem"
        >
          {region}
        </p>
      ))}
    </div>
  );

  return (
    <div data-testid="Home">
      <h1>Home Page</h1>
      <p>Please select both Cloud Provider and Region to see options.</p>
      {initialCloudState.status === 'loading' && <Loading />}
      {initialCloudState.status === 'fail' && (
        <p data-testid="Error">
          <NoResult />
        </p>
      )}
      {initialCloudState.status === 'success' && (
        <>
          <p className={styles.textCapitalize} data-testid="HomeCloudProviders">
            Cloud Providers:{' '}
            {
              cloudProviderMapper[
                initialCloudState.selectedClouds.cloudProvider as TCloudProviderValues
              ]
            }
          </p>
          <CloudProvider
            onSelect={(value: TCloudProviderValues) => dispatch(setProvider(value))}
          />
        </>
      )}
      {initialCloudState.status === 'success' && initialCloudState.clouds.length > 0 && (
        <>
          {userLocation.latitude === 0 && userLocation.longitude === 0 && (
            <p>
              Please let us know your location to list closest Cloud Providers to you!
            </p>
          )}
          <p className={styles.textCapitalize} data-testid="HomeRegions">
            Regions: {initialCloudState.selectedClouds.region}
          </p>
          {initialCloudState.regions.length > 0 && renderListRegions()}

          {shouldHideCloudProviders() && <NoResult />}

          {initialCloudState.selectedClouds.list.length > 0 &&
            renderSelectedRegionClouds()}
        </>
      )}
    </div>
  );
}
