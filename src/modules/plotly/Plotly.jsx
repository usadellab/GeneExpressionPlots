import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
// import Plot from 'react-plotly.js';
// import Plotly from 'plotly.js';

import mockData from '../../test_data/mock-DB.json';


/**
 * @typedef {import('../data/store').Group} Group
 * @typedef {import('../data/store').Sample} Sample
 * @typedef {import('../data/store').Replicate[]} Replicate
 */


const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);


/* DATA PROCESSING */

/**
 * Compute the count average for each accession in sample replicates.
 * @param {Replicate[]} replicates array of replicates
 * @returns {Object<string,number>} count averages per accession id
 */
const computeAverage = (replicates) => {

  const averages = {};

  replicates.forEach(replicate => {

    for (const [key, value] of Object.entries(replicate)) {

      const meanValue = value / replicates.length;

      if (averages[key])
        averages[key] += meanValue;

      else
        averages[key] = meanValue;

    }
  });
  return averages;
};

/**
 * Compute the count variance for each accession in sample replicates.
 * @param {Replicate[]}           replicates array of replicates
 * @param {Object<string,number>} averages   accession-average key-value pairs
 * @returns {Object<string,number>} count variances per accession id
 */
const computeVariance = (replicates, averages) =>{

  const variances = {};

  replicates.forEach(replicate => {

    for (const [key, value] of Object.entries(replicate)) {

      const squareMeanDiff = ((averages[key] - value)**2)/replicates.length;

      if (variances[key])
        variances[key] += squareMeanDiff;

      else
        variances[key] = squareMeanDiff;
    }

  });

  return variances;
};


/**
 * Compute average and variance of each replicate in the sample.
 *
 * @typedef {Object} SampleMeanVars
 * @property {Object<string,number} averages
 * @property {Object<string,number} variances
 *
 * @param {{}}     result collection of sample averages and variances per accession id
 * @param {Sample} sample a group sample
 */
const sampleAveragesAndVariancesReducer = (result, sample) => {

  const averages  = computeAverage(sample.replicates);
  const variances = computeVariance(sample.replicates, averages);

  return Object.assign(result, {
    [sample.name]: { averages, variances }
  });

};


/**
 * Compute average and variance of each replicate accession in the group samples.
 * @param {SampleMeanVars} result average and variance of each accession id
 * @param {Group}          group  group data
 */
const groupAveragesAndVariancesReducer = (result, group) => {

  return Object.assign(result, {
    [group.name]: group.samples.reduce( sampleAveragesAndVariancesReducer, {} )
  });

};

const h = mockData.reduce( groupAveragesAndVariancesReducer, {} );


const colors = [
  '#f3cec9',
  '#e7a4b6',
  '#cd7eaf',
  '#a262a9',
  '#6f4d96',
  '#3d3b72',
  '#182844',
];


/* PLOT CANDIDATE 1 */

function createPlot1 (h, group, accession, colorIndex) {
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

const MERISTEM = createPlot1(h,'Heat-Shock Arabidopsis : Meristem', 'PGSC0003DMT400039136', 0);
const APICAL = createPlot1(h,'Heat-Shock Arabidopsis : Apical', 'PGSC0003DMT400039136', 1);


/* PLOT CANDIDATE 2 */

const createPlot2 = function(h, accession){
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

const GENE_1 = createPlot2(h, 'PGSC0003DMT400039136');


/* PLOT CANDIDATE 3 */

function createPlot3 (sampleName, accessionId) {

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

const DAS_1 = createPlot3('DAS-1', 'PGSC0003DMT400039136');
const DAS_2 = createPlot3('DAS-2', 'PGSC0003DMT400039136');
const DAS_5 = createPlot3('DAS-5', 'PGSC0003DMT400039136');


/* RENDER PLOTS */

export default function PlotlyComponent() {

  return (
    <div className="flex flex-wrap justify-center">

      <Plot
        data={[
          APICAL,
          MERISTEM,
        ]}
        config={{
          responsive: true
        }}
        layout={{
          bargap: 0.1,
          showlegend: true,
          legend: {
            // orientation:'v',
            // yanchor:'top',
            xanchor:'right'
          }
        }}
      />

      <Plot
        data={[ GENE_1 ]}
        layout={{
          bargap: 0.1,
        }}
      />

      <Plot
        data={[
          DAS_1,
          DAS_2,
          DAS_5,
        ]}
        layout={{
          barmode:'group',
          legend: {
            xanchor:'right'
          }
        }}
      />
    </div>
  );
}