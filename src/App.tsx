import { lazy, Suspense } from 'react';

import Header from 'components/Header';
import Loading from 'components/Loading';

import './app.css';

const Home = lazy(() => import('pages/Home'));

function App() {
  return (
    <div className="app" data-testid="App">
      <Header />
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </div>
  );
}

export default App;
