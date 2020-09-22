import { plotData } from './data';


const colors = [
  '#2D44E0',
  '#12836A',
  '#B822B9',
  '#B24D0C',
  '#163693',
  // '#f3cec9',
  // '#e7a4b6',
  // '#cd7eaf',
  // '#a262a9',
  // '#6f4d96',
  // '#3d3b72',
  // '#182844',
];


function createBarSubplots (plotData, group, accession, colorIndex) {
  let groupArr = [];
  let sampleArr = [];
  let y = [];
  let errs = [];
  let color = [];

  Object.keys(plotData[group]).forEach(sampleName =>{

    const sample = plotData[group][sampleName];

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
    marker:{
      color
    },
    type:'bar',
    name: group
  };
}


export function createBarPlot (accession, showlegend) {
  let data = [];
  Object.keys(plotData).forEach(group => {
    data.push(createBarGroup(accession,group));
  });

  let config = {
    responsive: true
  };

  let layout = {
    showlegend,
    legend: {
      orientation:'h',
      x: 0,
      y: 1.14,

    },
    title: {
      text: `${accession}`,
      font: {
        size: 14
      }
    },
    yaxis: {
      title:{
        text: 'count [tpm]' // access to the unit needs to be variable
      }
    },
    xaxis: {
      tickangle: 'auto',
    }

  };

  return {data, config, layout};
}

function createBarGroup (accession, group){
  let groupArr = [];
  let sampleArr = [];
  let y = [];
  let errs = [];

  Object.keys(plotData[group]).forEach(sampleName =>{

    const sample = plotData[group][sampleName];

    groupArr.push(group);
    sampleArr.push(sampleName);
    y.push(sample.averages[accession]);
    errs.push(sample.variances[accession]);
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
    type:'bar',
    name: group
  };
}

const MERISTEM_1 = createBarSubplots(plotData,'Heat-Shock Arabidopsis : Meristem', 'PGSC0003DMT400039136', 0);
const APICAL_1 = createBarSubplots(plotData,'Heat-Shock Arabidopsis : Apical', 'PGSC0003DMT400039136', 1);
const STOLON_1 = createBarSubplots(plotData,'Heat-Shock Arabidopsis : Stolon', 'PGSC0003DMT400039136', 2);

const MERISTEM_2 = createBarSubplots(plotData,'Heat-Shock Arabidopsis : Meristem', 'PGSC0003DMT400039134', 0);
const APICAL_2 = createBarSubplots(plotData,'Heat-Shock Arabidopsis : Apical', 'PGSC0003DMT400039134', 1);
const STOLON_2 = createBarSubplots(plotData,'Heat-Shock Arabidopsis : Stolon', 'PGSC0003DMT400039134', 2);

MERISTEM_1['xaxis'] = 'x1';
MERISTEM_1['yaxis'] = 'y1';
APICAL_1['xaxis'] = 'x1';
APICAL_1['yaxis'] = 'y1';
STOLON_1['xaxis'] = 'x1';
STOLON_1['yaxis'] = 'y1';

MERISTEM_2['xaxis'] = 'x2';
MERISTEM_2['yaxis'] = 'y2';
MERISTEM_2['showlegend'] = false;
APICAL_2['xaxis'] = 'x2';
APICAL_2['yaxis'] = 'y2';
APICAL_2['showlegend'] = false;
STOLON_2['xaxis'] = 'x2';
STOLON_2['yaxis'] = 'y2';
STOLON_2['showlegend'] = false;

export const plot = {
  data: [
    MERISTEM_1,
    APICAL_1,
    STOLON_1,

    MERISTEM_2,
    APICAL_2,
    STOLON_2,
  ],
  config: {
    responsive: true
  },
  layout: {
    bargap: 0.1,
    showlegend: true,
    legend: {
      // orientation:'v',
      // yanchor:'top',
      xanchor:'right'
    },
    grid: {rows: 1, columns: 2, pattern: 'independent'},
    yaxis:{
      title:{
        text: 'count [tpm]'
      }
    },
  }
};
