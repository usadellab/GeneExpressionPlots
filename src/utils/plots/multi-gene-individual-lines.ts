import { mean, deviation } from 'd3';

import { dataTable } from '@/store/data-store';
import { settings } from '@/store/settings';
import { PlotData } from 'plotly.js';
import { PlotlyOptions } from '@/types/plots';
import { colors } from '@/pages/plots/components/PlotlyPlot';

const multiGeneIndividualLinesData = (
  accessions: string[],
  options: PlotlyOptions
): Partial<PlotData>[] => {
  const data: Partial<PlotData>[] = [];
  accessions.forEach((accession, accessionIndex) => {
    const plotData = dataTable.getRowAsTree(accession) as any;
    const line = {
      color: colors[accessionIndex],
    };

    settings.groupOrder.forEach((groupName, groupIndex) => {
      const x: string[][] = [[], []];
      const y: number[] = [];
      const error_y: number[] = [];
      // const traceName = showOnlyFirstLegend ? accessionId : groupName;
      settings.sampleOrder.forEach((sampleName) => {
        const groupSamplePlotData = plotData[groupName][sampleName];
        if (groupSamplePlotData) {
          x[0].push(groupName);
          x[1].push(sampleName);
          y.push(mean(groupSamplePlotData));
          error_y.push(deviation(groupSamplePlotData));
        }
      });
      // let showlegend = showOnlyFirstLegend ? (index > 0 ? false : true) : true;
      // data.push(createTrace(x, y, error_y, traceName, type, showlegend, line));
      data.push({
        x,
        y,
        error_y: { type: 'data', array: error_y, visible: true },
        name: accession,
        type: 'scatter',
        showlegend: groupIndex > 0 ? false : options.showlegend,
        line,
      });
    });
  });

  return data;
};

export default multiGeneIndividualLinesData;
