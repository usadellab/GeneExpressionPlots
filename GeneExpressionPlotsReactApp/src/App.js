import React, {useState} from 'react';
import './App.css';
import Plotly from './components/Plotly'
import FileReader from './components/FileReader'
import FileList from './components/FileList'
import GeneCountsDb from "./GeneCountsDb"

function App() {

  const [data, setData] = useState(true)

  const callback = (geneCountsDb) => {
    console.log("GENECOUNTSDB: " + JSON.stringify(geneCountsDb))
    setData(geneCountsDb)
  }
  
  const getData = () => {
    return data;
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          A very cool Plotly Plot
        </p>
        <div>
          <FileReader callback={callback}/>
          {/* <FileList /> */}
        </div>
        <p />
        <div>
          <Plotly getData={getData}/>
        </div>
      </header>
    </div>
  );
}

export default App;
