import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function Plotly(props) {

  const[geneCountsDb, setGeneCountsDb] = useState({})
  const[data, setData] = useState([
  {
    x: [],
    y: [],
    type: 'scatter'
  }])
  // const [frames, setFrames] = useState([]);
  const [config, setConfig] = useState({
    responsive: true, 
    displaylogo: false
  }); 

  // console.log("props.getData(): " + JSON.stringify(props.getData()));

  React.useEffect(() => {
    console.log("useEffect data: " + JSON.stringify(geneCountsDb))
  }, [geneCountsDb])

  const updateData = () => {
    setGeneCountsDb(props.getData());
    console.log("props.getData(): " + JSON.stringify(props.getData()));
    console.log("geneCountsDb" + JSON.stringify(geneCountsDb))

    // setData({
    //   x: Object.keys(geneCountsDb.geneCountInstances[0].geneCounts),
    //   y: Object.values(geneCountsDb.geneCountInstances[0].geneCounts)
    // })
    setData([{
      x: Object.keys(geneCountsDb.geneCountInstances[0].geneCounts),
      y: Object.values(geneCountsDb.geneCountInstances[0].geneCounts),
      // x: [1, 2, 3],
      // y: [2, 6, 3],
      type: 'scatter',
    },
    ])
  }

  // const generatePlot = () => {
    
  // }


  // data.x = Object.keys(props.geneCountsDb.geneCountInstances[0].geneCounts)
  // data.x = Object.values(props.geneCountsDb.geneCountInstances[0].geneCounts)
  // console.log(JSON.stringify(props))
  // data.type = 'scatter'

  return (
    <div>
      <Plot
      data = {data}
      // frames={frames}
      config={config}
        // data={[
        //   {
        //     x: [1, 2, 3],
        //     y: [2, 6, 3],
        //     type: 'scatter',
        //     mode: 'lines+markers',
        //     marker: {color: 'red'},
        //   },
        //   {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        // ]}
        onInitialized={(figure) => {
          setData(figure.data);
          console.log("onInitialized: "+JSON.stringify(figure))
          // setLayout(figure.layout);
          // setFrames(figure.frames);
          setConfig(figure.config);
        }}
        onUpdate={(figure) => {
          setData(figure.data);
          console.log("onUpdate: "+JSON.stringify(figure))
          // setLayout(figure.layout);
          // setFrames(figure.frames);
          setConfig(figure.config);
        }}
        layout={ {width: 640, height: 480, title: 'A Fancy Plot'} }
      />
      <div>
        <button onClick={updateData}> get data</button>
        {/* <button onClick={generatePlot}> generate Plot</button> */}
      </div>
    </div>
  )
}

export default Plotly
