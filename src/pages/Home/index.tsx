import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchClouds, setRegion, setProvider } from 'reducers/clouds';
import Loading from 'components/Loading';
import CloudProvider from './components/CloudProvider';
import { cloudProviderMapper, TCloudProviderValues } from 'reducers/constants/cloud';
import NoResult from 'components/NoResult';

import styles from './Home.module.scss';

export default function Home() {
  const dispatch = useAppDispatch();
  const initialCloudState = useAppSelector((state) => state.clouds);
  // const userLocation = useAppSelector((state) => state.user.location);

  useEffect(() => {
    dispatch(fetchClouds());
    // navigator.geolocation.getCurrentPosition(locationPermissionOnSuccess);
  }, []);

  // function locationPermissionOnSuccess(userLocation: GeolocationPosition) {
  //   dispatch(
  //     setLocation({
  //       latitude: userLocation.coords.latitude,
  //       longitude: userLocation.coords.latitude
  //     })
  //   );
  // }

  // Render functions
  const renderSelectedRegionClouds = () => (
    <div data-testid="List">
      {initialCloudState.selectedClouds.list.map((cloud, index) => (
        <p key={index}>{cloud.cloud_name}</p>
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
      <p className={styles.textCapitalize}>
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
      {initialCloudState.status === 'success' && initialCloudState.clouds.length > 0 && (
        <>
          {/* {(userLocation.latitude === 0 || userLocation.longitude === 0) && (
            <p>
              Please let us know your location to list closest Cloud Providers to you!
            </p>
          )} */}
          <p className={styles.textCapitalize}>
            Regions: {initialCloudState.selectedClouds.region}
          </p>
          {initialCloudState.regions.length > 0 && renderListRegions()}
          {initialCloudState.selectedClouds.list.length === 0 &&
            initialCloudState.selectedClouds.cloudProvider.length !== 0 &&
            initialCloudState.selectedClouds.region.length !== 0 && <NoResult />}
          {initialCloudState.selectedClouds.list.length > 0 &&
            renderSelectedRegionClouds()}
        </>
      )}
      {}
    </div>
  );
}
