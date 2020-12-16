// import Plotly from 'plotly.js/lib/core';
import { dataTable } from '@/store/data-store';
import { mean, deviation } from 'd3';


/**
 * @typedef {import('../store/plot-store').PlotOptions} PlotOptions
 */

const colors = [
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
 * create a single Gene grouped Plot. That can be either single-gene Bar or single-gene individual curves
 * @param {string[]} accessionIds
 * @param {PlotOptions} options 
 */
export function singleGeneGroupedPlot(accessionIds, options) {
  let accessionId = accessionIds[0];
  let plotData = dataTable.getRowAsTree(accessionId);

  let data = createGroupedPlotFromGene(plotData, accessionId, options);
  let layout = getDefaultLayout(options.showlegend, options.countUnit, options.plotTitle);
  
  return {data, layout, config: options.config, accessions: accessionId, showCaption: options.showCaption, plotId: options.plotId};
}


/**
 * create a plotly multi gene bar plot
 * @param {string[]} accessionIds 
 * @param {PlotOptions} options 
 */
export function multiGeneBarPlot(accessionIds, options){
  let data = [];
  accessionIds.forEach(accession => {
    let plotData = dataTable.getRowAsGroups(accession,1);
    let x = [[],[]];
    let y = [];
    let error_y = [];
    plotData.forEach((value, key) => {
      x[0].push(key[0]);
      x[1].push(key[1]);
      y.push(mean(value));
      error_y.push(deviation(value));
    });
    data.push(createTrace(x,y,error_y,accession, 'bar', options.showlegend));
  });

  let layout = getDefaultLayout(options.showlegend, options.countUnit, options.plotTitle);
  return {data, layout, config: options.config, accessions: accessionIds, showCaption: options.showCaption, plotId: options.plotId};
}

/**
 * create a plolty multi Gene individual curves plot
 * @param {string[]} accessionIds 
 * @param {PlotOptions} options 
 */
export function multiGeneIndCurvesPlot(accessionIds, options) {
  let data = [];
  accessionIds.forEach((accession,index) => {
    const plotData = dataTable.getRowAsTree(accession);
    const line = {
      color : colors[index],
    };
    // showLegendCurve = index > 0 ? false : true;
    data.push(...createGroupedPlotFromGene(plotData, accession, options, line, true));

  });

  let layout = getDefaultLayout(options.showlegend, options.countUnit, options.plotTitle);
  return {data, layout, config: options.config, accessions: accessionIds, showCaption: options.showCaption, plotId: options.plotId};
}

/**
 * create a plolty stacked line-plot
 * @param {string[]} accessionIds 
 * @param {PlotOptions} options 
 */
export function stackedLinePlot(accessionIds, options) {
  let data = [];
  let colorIndex = 0;
  let styleIndex = 0;
  let line = null;
  let marker = null;
  accessionIds.forEach(accession => {
    let plotData = dataTable.getRowAsTree(accession);
    Object.keys(plotData).forEach(groupName => {
      let name = groupName;
      let x = [];
      let y = [];
      let error_y = [];
      if (accessionIds.length > 1) {
        line = {
          color: colors[colorIndex],
          dash: lineStyles[styleIndex]
        };
        marker = {
          symbol: markerStyles[styleIndex]
        };
        name = `${groupName} - ${accession}`; 
      }
      options.colorBy === 'group' ? colorIndex++ : styleIndex++;
      Object.keys(plotData[groupName]).forEach(sampleName => {
        x.push(sampleName);
        y.push(mean(plotData[groupName][sampleName]));
        error_y.push(deviation(plotData[groupName][sampleName]));
      });
      data.push(createTrace(x,y,error_y, name, 'scatter', options.showlegend, line, marker));
    });
    options.colorBy === 'group' ? (colorIndex = 0, styleIndex++) : (colorIndex++, styleIndex = 0);
  });

  let layout = getDefaultLayout(options.showlegend, options.countUnit, options.plotTitle);
  return {data, layout, config: options.config, accessions: accessionIds, showCaption: options.showCaption, plotId: options.plotId};
}

/**
 * creates one "group" of single-gene bar/individual-curves or multi-gene individual curves
 * @param {string[]} accessionIds 
 * @param {PlotOptions} options 
 */
function createGroupedPlotFromGene(plotData, accessionId, options, line, showOnlyFirstLegend = false) {
  let data = [];
  let type = options.plotType === 'bars' ? 'bar' : 'scatter';
  Object.keys(plotData).forEach((groupName, index) => {
    let x = [[],[]];
    let y = [];
    let error_y = [];
    Object.keys(plotData[groupName]).forEach(sampleName => {
      x[0].push(groupName);
      x[1].push(sampleName);
      y.push(mean(plotData[groupName][sampleName]));
      error_y.push(deviation(plotData[groupName][sampleName]));
    });
    let showlegend = showOnlyFirstLegend ? ( index > 0 ? false : true ) : true;
    data.push(createTrace(x,y,error_y, accessionId, type, showlegend, line));
  });
  return data;
}

/**
 * create a generic plotly trace
 * @param {array} x 
 * @param {array} y 
 * @param {array} error_y 
 * @param {string} name 
 * @param {string} type 
 * @param {boolean} showlegend 
 * @param {object} line 
 * @param {object} marker 
 */
function createTrace(x, y, error_y, name, type, showlegend, line, marker) {
  return {
    x,
    y,
    error_y: {
      type: 'data',
      array: error_y,
      visible: true
    },
    type,
    name,
    showlegend,
    ...(line && {line}),
    ...(marker && {marker})
  };
}