import { DataRow } from '@/store/dataframe';
import { PCA } from 'ml-pca';

import { Layout, PlotData } from 'plotly.js';
import { getSubheaderColors } from '../color';
import { toArrayOfColumns } from '../store';

const sprintfNum = (num: number): string => {
  return (Math.round(num * 1000) / 1000).toFixed(3);
};

const pcaData = (
  rows: DataRow,
  srcReplicateNames: string[],
  multiHeaderSep: string,
  plotTitle?: string
): {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
} => {
  const data2dArr = toArrayOfColumns(rows);
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
      text: srcReplicateNames,
      textfont: {
        family: 'Times New Roman',
      },
      textposition: 'bottom center',
      marker: {
        size: 12,
        color: getSubheaderColors(2, srcReplicateNames, multiHeaderSep),
      },
    },
  ];

  const varExpl = pca.getExplainedVariance();
  const layout: Partial<Layout> = {
    title: {
      text: plotTitle,
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
