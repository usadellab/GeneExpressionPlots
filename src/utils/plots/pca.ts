import { DataRows } from '@/store/dataframe';
import { PCA } from 'ml-pca';

import { Layout, PlotData } from 'plotly.js';
import { getColors } from '../color';
import {
  toArrayOfColumns,
  toArrayOfRows,
  transposeMatrix,
  zTransformMatrix,
} from '../store';

const sprintfNum = (num: number): string => {
  return (Math.round(num * 1000) / 1000).toFixed(3);
};

export function createPCAplot(
  dataRows: DataRows,
  srcReplicateNames: string[],
  srcAccessionIds: string[],
  multiHeaderSep: string,
  zTransform: boolean,
  plotTitle?: string,
  transpose = false
): {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
} {
  let data2dArr = toArrayOfColumns(
    dataRows,
    srcReplicateNames,
    srcAccessionIds
  );

  if (zTransform) data2dArr = zTransformMatrix(data2dArr);

  if (transpose) data2dArr = transposeMatrix(data2dArr);

  const pca = new PCA(data2dArr);
  // Project the data2dArr into PC coordinate system:
  const projectedData = pca.predict(data2dArr);

  // Plot using Plotly.js:
  const traceNames = transpose ? srcAccessionIds : srcReplicateNames;
  const traces = traceNames.reduce(
    (acc: { [key: string]: Partial<PlotData> }, name: string, i) => {
      const replicateSplit = name.split(multiHeaderSep);
      const key = transpose
        ? name
        : `${replicateSplit[0]}${multiHeaderSep}${replicateSplit[1]}`;
      if (acc[key]) {
        (acc[key].x as number[]).push(projectedData.getRow(i)[0]);
        (acc[key].y as number[]).push(projectedData.getRow(i)[1]);
        (acc[key].text as string[]).push(name);
      } else {
        acc[key] = {
          x: [projectedData.getRow(i)[0]],
          y: [projectedData.getRow(i)[1]],
          type: 'scatter',
          mode: 'markers',
          marker: { size: 9 },
          name: key + '       ',
          text: [name],
          textfont: {
            family: 'Times New Roman',
          },
          textposition: 'bottom center',
        };
      }
      return acc;
    },
    {}
  );

  const colors = getColors(Object.keys(traces).length);

  const data = Object.values(traces);

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
    showlegend: true,
    autosize: true,
    hovermode: 'closest',
    colorway: colors,
  };

  return {
    data,
    layout,
  };
}
