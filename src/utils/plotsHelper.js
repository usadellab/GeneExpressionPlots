// import Plotly from 'plotly.js/lib/core';
import {store} from '@/store';
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
function getDefaultLayout(showlegend, accessionId, countUnit) {
  return {
    showlegend,
    legend: {
      orientation:'h',
      x: 0,
      y: 1.14,
  
    },
    title: {
      text: `${accessionId}`,
      font: {
        size: 14
      }
    },
    yaxis: {
      title:{
        text: `count [${countUnit}]` // access to the unit needs to be variable
      }
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
 * creat a Grouped Plot. That is either a bar or a scatter plot. The groups are seperated
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {string} accessionId accessionId to plot the data for
 * @param {boolean} showlegend show the legend of the plot 
 * @param {string} countUnit unit used for the y-label
 * @param {string} plotType type of the plot. can be either bar or scatter
 */
export function createGroupPlot (plotData, accessionId, showlegend, countUnit, plotType, index) {
  let data = [];
  Object.keys(plotData).forEach(group => {
    data.push(createPlotGroup(plotData, group, plotType));
  });

  let layout = getDefaultLayout(showlegend, accessionId, countUnit);

  return {data, layout, config: config(index)};
}

/**
 * create a single group for the grouped plot
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {object} group group to plot
 * @param {string} plotType type of the plot. can be either bar or scatter
 */
function createPlotGroup (plotData, group, plotType){
  let groupArr = [];
  let sampleArr = [];
  let y = [];
  let errs = [];

  Object.keys(plotData[group]).forEach(sampleName =>{

    const sample = plotData[group][sampleName];

    groupArr.push(group);
    sampleArr.push(sampleName);
    y.push(sample.average);
    errs.push(sample.variance);
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
    name: group
  };
}

/**
 * create a stacked Line plot, that is a Plot with multiple traces; one for each group
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {string} accessionId accessionId to plot the data for
 * @param {boolean} showlegend show the legend of the plot 
 * @param {string} countUnit unit used for the y-label
 */
export function createStackedLinePlot(plotData, accessionId, showlegend, countUnit, index) {
  let data = [];
  Object.keys(plotData).forEach(group => {
    data.push(createLinePlotTrace(plotData, group));
  });
  let layout = getDefaultLayout(showlegend, accessionId, countUnit);
  return {data, layout, config: config(index)};
}

/**
 * create a single Trace for the stacked Curves Plot
 * @param {object} plotData plotData used to build the plot from. Contains averages and variances for the given accessionId
 * @param {object} group group to plot
 */
function createLinePlotTrace(plotData, group) {

  let trace = {
    x: [],
    y: [],
    error_y: {
      type: 'data',
      array: [],
      visible: true
    },
    type: 'scatter',
    name: group
  };

  Object.keys(plotData[group]).forEach(sampleName => {
    
    const sample = plotData[group][sampleName];
    
    trace.x.push(sampleName);
    trace.y.push(sample.average);
    trace.error_y.array.push(sample.variance);

  });

  return trace;
}

/**
 * compute avevrages and variances for each group and sample given a specific Gene accessionId
 * @param {array} groups groups array as it is in the mobx store
 * @param {string} accessionId accessionId to calculate the averages and variances for
 */
export function computeAveragesAndVariances(groups, accessionId) {
  /**
     * {
     *   [groupName]: {
     *      [sampleName]: {
     *        average:,
     *        variance:,
     *      }
     *   }
     * }
     */
  let plotData = {};
  groups.forEach(group => {
    plotData[group.name] = {};
    group.samples.forEach(sample => {
      plotData[group.name][sample.name] = {
        average: computeAverage(sample.replicates, accessionId),
      };
      plotData[group.name][sample.name].variance = computeVariance(
        sample.replicates, accessionId, plotData[group.name][sample.name].average
      );
    });
  });

  return plotData;
}