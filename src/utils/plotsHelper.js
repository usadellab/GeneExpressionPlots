export const computeAverage = (replicates, accessionId) => {
  return replicates.reduce((average, current) => average += (current[accessionId] / replicates.length), 0);
};

export const computeVariance = (replicates, accessionId, average) => {
  return replicates.reduce((variance, current) => variance += ((average - current[accessionId])**2)/replicates.length, 0);
};

export function createBarPlot (plotData, accessionId, showlegend, countUnit, plotType) {
  let data = [];
  Object.keys(plotData).forEach(group => {
    data.push(createBarGroup(plotData, group, plotType));
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

  return {data, config, layout};
}

function createBarGroup (plotData, group, plotType){
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