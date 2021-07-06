import { mean, deviation } from 'd3';

import { dataTable } from '@/store/data-store';
import { settings } from '@/store/settings';
import { MarkerSymbol, PlotData } from 'plotly.js';
import { PlotlyOptions } from '@/types/plots';
import { colors } from '@/pages/plots/components/plotly-plot';
import { Dash } from 'plotly.js/lib/traces/ohcl';

const lineStyles: Dash[] = [
  'solid',
  'dot',
  'dash',
  'longdash',
  'dashdot',
  'longdashdot',
];
const markerStyles: MarkerSymbol[] = [
  'circle',
  'square',
  'diamond',
  'cross',
  'triangle-up',
  'pentagon',
];

const stackedLinesData = (
  accessions: string[],
  options: PlotlyOptions
): Partial<PlotData>[] => {
  console.log({ options });
  const data: Partial<PlotData>[] = [];
  let colorIndex = 0;
  let styleIndex = 0;
  accessions.forEach((accession) => {
    const plotData = dataTable.getRowAsTree(accession) as any;
    settings.groupOrder.forEach((groupName) => {
      const x: string[] = [];
      const y: number[] = [];
      const error_y: number[] = [];
      options.colorBy === 'group' ? colorIndex++ : styleIndex++;
      settings.sampleOrder.forEach((sampleName) => {
        const groupSamplePlotData = plotData[groupName][sampleName];
        if (groupSamplePlotData) {
          x.push(sampleName);
          y.push(mean(groupSamplePlotData));
          error_y.push(deviation(groupSamplePlotData));
        }
      });
      data.push({
        x,
        y,
        error_y: { type: 'data', array: error_y, visible: true },
        name: accessions.length > 1 ? `${groupName} - ${accession}` : groupName,
        type: 'scatter',
        showlegend: options.showlegend,
        line:
          accessions.length > 1
            ? {
                color: colors[colorIndex],
                dash: lineStyles[styleIndex],
              }
            : {},
        marker:
          accessions.length > 1
            ? {
                symbol: markerStyles[styleIndex],
              }
            : {},
      });
    });
    options.colorBy === 'group'
      ? ((colorIndex = 0), styleIndex++)
      : (colorIndex++, (styleIndex = 0));
  });
  return data;
};

export default stackedLinesData;
