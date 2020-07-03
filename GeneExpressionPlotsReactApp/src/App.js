import React from 'react';
import './App.css';
import Plotly from './components/Plotly'
import FileReader from './components/FileReader'
import InputArguments from './components/InputArguments'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          A very cool Plotly Plot
        </p>
        <div>
          <Plotly />
        </div>
        <div>
          <FileReader />
        </div>
      </header>
    </div>
  );
}

export default App;
