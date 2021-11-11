import { mean, deviation } from 'd3';

import { dataTable } from '@/store/data-store';
import { settings } from '@/store/settings';
import { PlotData } from 'plotly.js';
import { PlotlyOptions } from '@/types/plots';

const singleGeneIndividualLinesData = (
  accession: string,
  options: PlotlyOptions
): Partial<PlotData>[] => {
  const plotData = dataTable.getRowAsTree(accession) as any;

  const data: Partial<PlotData>[] = [];
  settings.groupOrder.forEach((groupName) => {
    const x: string[][] = [[], []];
    const y: number[] = [];
    const error_y: number[] = [];
    settings.sampleOrder.forEach((sampleName) => {
      const groupSamplePlotData = plotData[groupName][sampleName];
      if (groupSamplePlotData) {
        x[0].push(groupName);
        x[1].push(sampleName);
        y.push(mean(groupSamplePlotData) as number);
        error_y.push(deviation(groupSamplePlotData) as number);
      }
    });
    data.push({
      x,
      y,
      error_y: { type: 'data', array: error_y, visible: true },
      type: 'scatter',
      name: groupName,
      showlegend: options.showlegend,
    });
  });
  return data;
};

export default singleGeneIndividualLinesData;
