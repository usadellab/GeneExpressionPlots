import React, {useState} from 'react';
import './App.css';
import Plotly from './components/Plotly'
import FileReader from './components/FileReader'
import FileList from './components/FileList'
import GeneCountsDb from "./GeneCountsDb"

function App() {

  const [data, setData] = useState(true)

  const callback = (header) => {
    console.log("HEADER: " + header)
    setData(header)
  }

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
          <FileReader callback={callback}/>
          {/* <FileList /> */}
        </div>
      </header>
    </div>
  );
}

export default App;
