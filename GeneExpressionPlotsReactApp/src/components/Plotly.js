import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function Plotly(props) {

  const[geneCountsDb, setGeneCountsDb] = useState({})

  const[data, setData] = useState({
    x: [],
    y: [],
    type: 'scatter'
  })

  console.log("props.getData(): " + JSON.stringify(props.getData()));

  const updateData = () => {
    setGeneCountsDb(props.getData());
    console.log("data: " + JSON.stringify(geneCountsDb));
    setData({
      x: Object.keys(geneCountsDb.geneCountInstances[0].geneCounts),
      y: Object.values(geneCountsDb.geneCountInstances[0].geneCounts)
    })
  }


  // data.x = Object.keys(props.geneCountsDb.geneCountInstances[0].geneCounts)
  // data.x = Object.values(props.geneCountsDb.geneCountInstances[0].geneCounts)
  // console.log(JSON.stringify(props))
  // data.type = 'scatter'

  return (
    <div>
      <Plot
      data = {data}
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
        layout={ {width: 640, height: 480, title: 'A Fancy Plot'} }
      />
      <div>
        <button onClick={updateData}> get data and generate </button>
      </div>
    </div>
  )
}

export default Plotly
