import { dataTable } from '@/store/data-store';
import { PCA } from 'ml-pca';

import { Layout, PlotData } from 'plotly.js';

const sprintfNum = (num: number): string => {
  return (Math.round(num * 1000) / 1000).toFixed(3);
};

const pcaData = async (
  title?: string
): Promise<{
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
}> => {
  const data2dArr = dataTable.toArrayOfColumns();
  const pca = new PCA(data2dArr);
  // Project the data2dArr into PC coordinate system:
  const projectedData = pca.predict(data2dArr);
  // Plot using Plotly.js:
  const data: Partial<PlotData>[] = [
    {
      x: projectedData.getColumn(0),
      y: projectedData.getColumn(1),
      type: 'scatter',
      mode: 'markers',
      text: dataTable.colNames,
      textfont: {
        family: 'Times New Roman',
      },
      textposition: 'bottom center',
      marker: {
        size: 12,
        color: dataTable.getSubheaderColors(2),
      },
    },
  ];

  const varExpl = pca.getExplainedVariance();
  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: {
        size: 20,
      },
    },
    xaxis: {
      title: {
        text: `PC-1 (fraction of variance explained: ~${sprintfNum(
          varExpl[0]
        )})`,
      },
    },
    yaxis: {
      title: {
        text: `PC-2 (fraction of variance explained: ~${sprintfNum(
          varExpl[1]
        )})`,
      },
    },
    autosize: true,
    hovermode: 'closest',
  };

  return {
    data,
    layout,
  };
};

export default pcaData;
