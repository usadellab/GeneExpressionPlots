import React, { ReactElement, useMemo } from 'react';

import { dataTable, infoTable } from '@/store/data-store';
import { settings } from '@/store/settings';

import { mean, deviation } from 'd3';
import { PlotData } from 'plotly.js';
import { PlotlyPlot } from './PlotlyPlot';
import PlotCaption from './PlotCaption';
import { colors } from '@/utils/plotsHelper';
import { PlotlyOptions } from '../plots-home';

interface SingleGeneBarPlotProps {
  accession: string;
  options: PlotlyOptions;
}

export default function SingleGeneBarPlot({
  accession,
  options,
}: SingleGeneBarPlotProps): ReactElement {
  console.log({ accession, options });
  const plotData = dataTable.getRowAsTree(accession) as any;

  const layout = {};

  const data = useMemo(() => {
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
          y.push(mean(groupSamplePlotData));
          error_y.push(deviation(groupSamplePlotData));
        }
      });
      data.push({
        x,
        y,
        error_y: { type: 'data', array: error_y, visible: true },
        type: 'bar',
        name: accession,
        showlegend: options.showlegend,
      });
    });
    return data;
  }, [plotData, options, accession]);

  return (
    <PlotlyPlot plot={{ data, layout }} options={{ accessions: [accession] }}>
      {options.showCaption && (
        <PlotCaption
          key={`${accession}`}
          accession={accession}
          caption={infoTable.getRowAsMap(accession)}
          color={null}
        />
      )}
    </PlotlyPlot>
  );
}
