import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

import { usePlotStore } from '../store/context';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);


export default function PlotlyComponent() {

  const { state } = usePlotStore();

  return (
    state && state.map((plot, index) => (
      <Plot
        key={ `${plot?.layout?.title?.text}-${index}` }
        className="w-1/2 h-1/2 mt-10"
        { ...plot }
      />
    )
    )
  );
}