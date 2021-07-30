import { DataRows } from '@/store/dataframe';
import { PCA } from 'ml-pca';

import { Layout, PlotData } from 'plotly.js';
import { getColors, getSubheaderColors } from '../color';
import { toArrayOfColumns, toArrayOfRows } from '../store';

const sprintfNum = (num: number): string => {
  return (Math.round(num * 1000) / 1000).toFixed(3);
};

export function createPCAplot(
  dataRows: DataRows,
  srcReplicateNames: string[],
  srcAccessionIds: string[],
  multiHeaderSep: string,
  plotTitle?: string,
  transpose = false
): {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
} {
  const data2dArr = transpose
    ? toArrayOfRows(dataRows, srcReplicateNames, srcAccessionIds)
    : toArrayOfColumns(dataRows, srcReplicateNames, srcAccessionIds);
  const pca = new PCA(data2dArr);
  // Project the data2dArr into PC coordinate system:
  const projectedData = pca.predict(data2dArr);

  // Plot using Plotly.js:

  const colors = transpose
    ? getColors(srcAccessionIds.length)
    : getSubheaderColors(2, srcReplicateNames, multiHeaderSep);

  const data: Partial<PlotData>[] = [
    {
      x: projectedData.getColumn(0),
      y: projectedData.getColumn(1),
      type: 'scatter',
      mode: 'markers',
      text: transpose ? srcAccessionIds : srcReplicateNames,
      textfont: {
        family: 'Times New Roman',
      },
      textposition: 'bottom center',
      marker: {
        size: 12,
        color: colors,
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
}
