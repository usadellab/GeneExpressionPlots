// import Plotly from 'plotly.js/lib/core';
import {store} from '@/store';

export const colors = [
  '#1f77b4',  // muted blue
  '#ff7f0e',  // safety orange
  '#2ca02c',  // cooked asparagus green
  '#d62728',  // brick red
  '#9467bd',  // muted purple
  '#8c564b',  // chestnut brown
  '#e377c2',  // raspberry yogurt pink
  '#7f7f7f',  // middle gray
  '#bcbd22',  // curry yellow-green
  '#17becf'   // blue-teal
];

const lineStyles = ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot'];
const markerStyles = ['circle','square','diamond', 'cross', 'triangle-up','pentagon'];

/**
 * constant config object for plotly
 */
const config = (index) => ({
  responsive: true,
  toImageButtonOptions: {
    format: 'svg'
  },
  displaylogo: false,
  modeBarButtonsToAdd: [
    {
      name: 'Delete plot',
      icon: {
        'width': 21,
        'height': 21,
        'path': 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
      },
      click: function() {
        store.deletePlot(index);
      }
    }
  ]
});

/**
 *
 * @param {boolean} showlegend show the legend of the plot
 * @param {string} accessionId accessionId to plot the data for
 * @param {string} countUnit unit used for the y-label
 */
function getDefaultLayout(showlegend, countUnit, plotTitle) {
  return {
    title: {
      text: plotTitle,
      font: {
        family: 'ABeeZee',
        size: 24
      },
      y: 0.9,
    },
    showlegend,
    legend: {
      orientation:'h',
      x: 0,
      y: -0.30,

    },
    yaxis: {
      title:{
        text: `count [${countUnit}]` // access to the unit needs to be variable
      },
      hoverformat: '.2f'
    },
    xaxis: {
      tickangle: 'auto',
    }
  };
}

/**
 * compute the average gene count over all replicates for a specific gene
 * @param {Array} replicates list of replicates
 * @param {string} accessionId The accessionId to compute the avereage for
 */
export const computeAverage = (replicates, accessionId) => {
  return replicates.reduce((average, current) => average += (current[accessionId] / replicates.length), 0);
};

/**
 * compute the average gene count over all replicates for a specific gene
 * @param {Array} replicates list of replicates
 * @param {string} accessionId The accessionId to compute the avereage for
 * @param {number} average The computed average gene count over all replicates for the gien gene acecssion
 */
export const computeVariance = (replicates, accessionId, average) => {
  return replicates.reduce((variance, current) => variance += ((average - current[accessionId])**2)/replicates.length, 0);
};

/**
 * compute avevrages and variances for each group and sample given a specific Gene accessionId
 * @param {array} groups groups array as it is in the mobx store
 * @param {string} accessionId accessionId to calculate the averages and variances for
 */
export function computeAveragesAndVariances(groups, accessionIds) {
  /**
     * {
     *   [groupName]: {
     *      [sampleName]: {
     *        acc1:{
     *          average:,
     *          variance:
     *        }
     *        acc2:{
     *          average:,
     *          variance:
     *        }
     *      }
     *   }
     * }
     */
  let plotData = {};
  groups.forEach(group => {
    plotData[group.name] = {};
    group.samples.forEach(sample => {
      plotData[group.name][sample.name] = {};
      accessionIds.forEach(accession => {
        plotData[group.name][sample.name][accession] = {
          average: computeAverage(sample.replicates, accession)
        };
      });
      accessionIds.forEach(accession => {
        plotData[group.name][sample.name][accession].variance = computeVariance(
          sample.replicates, accession, plotData[group.name][sample.name][accession].average
        );
      });
    });
  });
  return plotData;
}

/**
 * create a Grouped Plot. That is either a bar or a scatter plot. The groups are seperated
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {string} accessionIds accessionId to plot the data for
 * @param {boolean} showlegend show the legend of the plot
 * @param {string} countUnit unit used for the y-label
 * @param {string} plotType type of the plot. can be either bar or scatter
 */
export function createGroupPlot (plotData, accessionIds, showlegend, showCaption, countUnit, plotType, plotIndex, plotTitle) {
  let data = [];
  let line = null;
  let showLegendCurve = null;
  accessionIds.forEach((accession, accessionIndex) => {
    if(accessionIds.length > 1) {
      line = {
        color : colors[accessionIndex],
      };
    }
    Object.keys(plotData).forEach((group,groupIndex) => {
      showLegendCurve = accessionIds.length > 1 ? (groupIndex > 0 ? false : true) : true;
      data.push(createPlotGroup(plotData, group, plotType, accession, line, showLegendCurve));
    });
  });

  let layout = getDefaultLayout(showlegend, countUnit, plotTitle);

  return {data, layout, config: config(plotIndex), accessions: accessionIds, showCaption: showCaption};
}

/**
 * create a single group for the grouped plot
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {object} group group to plot
 * @param {string} plotType type of the plot. can be either bar or scatter
 */
function createPlotGroup (plotData, group, plotType, accessionId, line, showlegend){
  let groupArr = [];
  let sampleArr = [];
  let y = [];
  let errs = [];
  Object.keys(plotData[group]).forEach(sampleName =>{

    const sample = plotData[group][sampleName];

    groupArr.push(group);
    sampleArr.push(sampleName);
    y.push(sample[accessionId].average);
    errs.push(sample[accessionId].variance);
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
    type: plotType,
    name: (line ? accessionId : group),
    ...(line && {line}),
    showlegend
  };
}

/**
 * create a stacked Line plot, that is a Plot with multiple traces; one for each group
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {string} accessionIds accessionId to plot the data for
 * @param {boolean} showlegend show the legend of the plot
 * @param {string} countUnit unit used for the y-label
 * @param {int} index plotIndex
 * @param {string} colorBy color the plot by group or gene. The other will be distinguishable by linestyle
 */
export function createStackedLinePlot(plotData, accessionIds, showlegend, showCaption, countUnit, index, colorBy, plotTitle) {
  let data = [];
  let colorIndex = 0;
  let styleIndex = 0;
  let line = null;
  let marker = null;
  accessionIds.forEach( accession => {
    Object.keys(plotData).forEach(group => {

      if (accessionIds.length > 1) {
        line = {
          color: colors[colorIndex],
          dash: lineStyles[styleIndex]
        };
        marker = {
          symbol: markerStyles[styleIndex]
        };
      }
      data.push(createLinePlotTrace(plotData, group, accession, line, marker));
      colorBy === 'group' ? colorIndex++ : styleIndex++;
    });
    colorBy === 'group' ? (colorIndex = 0, styleIndex++) : (colorIndex++, styleIndex = 0);
  });
  let layout = getDefaultLayout(showlegend, countUnit, plotTitle);
  return {data, layout, config: config(index), accessions: accessionIds, showCaption: showCaption};
}

/**
 * create a single Trace for the stacked Curves Plot
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {object} group group to plot
 */
function createLinePlotTrace(plotData, group, accessionId, line, marker) {

  let trace = {
    x: [],
    y: [],
    error_y: {
      type: 'data',
      array: [],
      visible: true
    },
    type: 'scatter',
    name: (line ? `${group} - ${accessionId}` : group),
    ...(line && {line}),
    ...(marker && {marker})
  };

  Object.keys(plotData[group]).forEach(sampleName => {

    const sample = plotData[group][sampleName];

    trace.x.push(sampleName);
    trace.y.push(sample[accessionId].average);
    trace.error_y.array.push(sample[accessionId].variance);

  });

  return trace;
}


export function createMultiGeneBarPlot(plotData, accessionIds, showlegend, showCaption, countUnit, index, plotTitle){
  let data = [];
  let x = [[],[]];
  let yData = {};
  accessionIds.forEach(accession => {
    yData[accession] = {averages: [], variances: []};
  });
  Object.keys(plotData).forEach(group => {
    Object.keys(plotData[group]).forEach(sample => {
      Object.keys(plotData[group][sample]).forEach(accession => {
        yData[accession].averages.push(plotData[group][sample][accession].average);
        yData[accession].variances.push(plotData[group][sample][accession].variance);
      });
      x[0].push(group);
      x[1].push(sample);
    });
  });
  Object.keys(yData).forEach(accession => {
    data.push(createGeneTrace(x,yData[accession].averages, yData[accession].variances,accession));
  });
  let layout = getDefaultLayout(showlegend, countUnit, plotTitle);
  return {data, layout, config: config(index), accessions: accessionIds, showCaption: showCaption};
}

function createGeneTrace(x, y, error_y, accession) {

  return {
    x,
    y,
    error_y: {
      type: 'data',
      array: error_y,
      visible: true
    },
    type:'bar',
    name: accession
  };
}