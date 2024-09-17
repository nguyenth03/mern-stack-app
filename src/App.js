import React from 'react';
import './App.scss';

// custom components
import AppBar from 'components/AppBar/AppBar';
import BoarBar from 'components/BoarBar/BoarBar';
import BoarContent from 'components/BoardContent/BoardContent';

function App() {
  return (
    <div className="master">
      <AppBar/>
      <BoarBar/>
      <BoarContent/>
    </div>
  );
}

export default App;
