import React, {
  Fragment
} from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
// import Plot from 'react-plotly.js';
// import Plotly from 'plotly.js';
import mock from '../../test_data/mock-DB.json';

// eslint-disable-next-line
const Plot = createPlotlyComponent(Plotly);


/* DATA PROCESSING */

const mergeData = (data) => {
  const result = {}; 

  data.forEach(replicate => { 
    for (let [key, value] of Object.entries(replicate)) { 
      if (result[key]) {
        result[key] += value/data.length;
      } else { 
        result[key] = value/data.length;
      }
    }
  });
  return result;
};

const calculateVariance = (data, averages) =>{
  const result = {}; 

  data.forEach(replicate => { 
    for (let [key, value] of Object.entries(replicate)) { 
      if (result[key]) {
        result[key] += ((averages[key] - value)**2)/data.length;
      } else { 
        result[key] = ((averages[key] - value)**2)/data.length;
      }
    }
  });
  return result;
};



const h = {};
mock.forEach(group => {

  h[group.name] = {};

  group.samples.forEach(sample => {
    const averages = mergeData(sample.replicates);
    const variances = calculateVariance(sample.replicates, averages);
    h[group.name][sample.name] = { averages, variances };
  });


});


/* PLOT ATTEMPT 1 */

const barCnt = function(h){
  return Object.keys(h).reduce((a,c)=> {a += Object.keys(h[c]).length; return a;},0);
};

const colors = ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844'];


const createPlot = function(h, accession){
  let groupArr = [];
  let sampleArr = [];
  let y = [];
  let errs = [];
  let color = [];
  Object.keys(h).forEach((group,index) => {
    Object.keys(h[group]).forEach(sampleName =>{

      const sample = h[group][sampleName];

      groupArr.push(group);
      sampleArr.push(sampleName);
      y.push(sample.averages[accession]);
      errs.push(sample.variances[accession]);
      color.push(colors[index]);
    });
  });
  const x = [groupArr, sampleArr];
  
  return {
    x,
    y,
    error_y:{
      type: 'data',
      array: errs,
      visible: true,
    },
    marker:{
      color
    },
    type:'bar',

  };
};

const GENE_1 = createPlot(h, 'PGSC0003DMT400039136');

/* PLOT ATTEMPT 2 */

function createSamplePlot (sampleName, accessionId) {

  const x = Object.keys(h);
  const y = Object.keys(h).map(k => h[k][sampleName].averages[accessionId]);
  const array = Object.keys(h).map(k => h[k][sampleName].variances[accessionId]);

  return {
    x,
    y,
    name: sampleName,
    type: 'bar',
    error_y: {
      type: 'data',
      array,
      visible: true,
    },
    marker: {
      color: [ 'green', 'blue' ],
      line: {
        color: 'black',
        width: .5,
      }
    },
    showlegend:true,
  };
}


const DAS_1 = createSamplePlot('DAS-1', 'PGSC0003DMT400039136');
const DAS_2 = createSamplePlot('DAS-2', 'PGSC0003DMT400039136');
const DAS_5 = createSamplePlot('DAS-5', 'PGSC0003DMT400039136');

/* PLOT ATTEMPT 3 */

function createFirstPlot (h, group, accession, colorIndex) {
  let groupArr = [];
  let sampleArr = [];
  let y = [];
  let errs = [];
  let color = [];

  Object.keys(h[group]).forEach(sampleName =>{

    const sample = h[group][sampleName];

    groupArr.push(group);
    sampleArr.push(sampleName);
    y.push(sample.averages[accession]);
    errs.push(sample.variances[accession]);
    color.push(colors[colorIndex]);

  });

  const x = [groupArr, sampleArr];
  
  return {
    x,
    y,
    error_y:{
      type: 'data',
      array: errs,
      visible: true,
    },
    // marker:{
    //   color
    // },
    type:'bar',
    name: group
  };
}


const MERISTEM = createFirstPlot(h,'Heat-Shock Arabidopsis : Meristem', 'PGSC0003DMT400039136', 0);
const APICAL = createFirstPlot(h,'Heat-Shock Arabidopsis : Apical', 'PGSC0003DMT400039136', 1);

export default function PlotlyComponent() {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '50%',
    }}>
      <div className="text-blue-500">This works</div>
      <Plot data = {
        [
          APICAL,
          MERISTEM,
        ]
      }


      layout = {
        {
          grid: {

          },
          bargap: 0.1,
          // bargroupgap: 1,
          showlegend: true,
          legend: {
            orientation:'v',
            yanchor:'top',
            xanchor:'right'
          }
          // grid: {
          //   xgap: .1,
          //   ygap: .1
          // }
        }
      }
      />
      <Plot
        data = { [ GENE_1, ] }
        layout = {
          {
            bargap: 0.1,
          }
        }
      />
      <Plot data = {
        [
          DAS_1,
          DAS_2,
          DAS_5,
        ]
      }


      layout = {
        {
          // bargap:.01,
          // bargroupgap:.1,
          barmode:'group',
          xaxis: {
            tickformatstops: [
              {
                value: 1,
              },
              {
                value: 2,
              },
              {
                value: 3,
              },
              {
                value: 4,
              },
              {
                value: 5,
              },
              {
                value: 6,
              },
            ]
          }
        }
      }
      />
    </div>
  );
}