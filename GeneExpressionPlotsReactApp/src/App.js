import React, {useState} from 'react';
import './App.css';
import Plotly from './components/Plotly'
import FileReader from './components/FileReader'

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

      <header> A very cool Plotly Plot </header>

      <FileReader callback={callback} />

      <Plotly getData={data} />

    </div>

  );
}

export default App;
