import Home from 'pages/Home';

import Header from 'components/Header';

import './app.css';

function App() {
  return (
    <div className="app" data-testid="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;
