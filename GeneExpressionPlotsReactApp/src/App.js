import React, {useState} from 'react';
import './App.css';
import Plotly from './components/Plotly'
import FileReader from './components/FileReader'
import FileList from './components/FileList'
import GeneCountsDb from "./GeneCountsDb"
import { Button } from '@material-ui/core';
// import PlotlyEditor, {DefaultEditor, Panel} from 'react-chart-editor'

function App() {

  const [data, setData] = useState({})

  const callback = (geneCountsDb) => {
    console.log("GENECOUNTSDB: " + JSON.stringify(geneCountsDb))
    // React.useEffect((geneCountsDb) => { setData(geneCountsDb) }, {})
    // setData(geneCountsDb)
    // console.log("APP data: " + JSON.stringify(data))
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
        </div>
        <p />
        <div>
          <Plotly getData={getData}/>
        </div>
        <div>
        </div>
      </header>
    </div>
  );
}

export default App;
