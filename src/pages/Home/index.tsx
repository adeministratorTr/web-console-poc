import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchClouds } from 'reducers/clouds';
import Loading from 'components/Loading';

export default function Home() {
  const dispatch = useAppDispatch();
  const initialCloudState = useAppSelector((state) => state.clouds);

  useEffect(() => {
    dispatch(fetchClouds());
  }, []);

  return (
    <div data-testid="Home">
      <h1>Home Page</h1>
      {initialCloudState.status === 'loading' && <Loading />}
      {initialCloudState.status === 'fail' && <p>Ooops. Something went wrong</p>}
      {initialCloudState.status === 'success' && initialCloudState.clouds.length > 0 && (
        <p data-testid="List">{initialCloudState.clouds[0].cloud_description}</p>
      )}
    </div>
  );
}
