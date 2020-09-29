import React from 'react';
import { observer } from 'mobx-react';
import createPlotlyComponent from 'react-plotly.js/factory';

import { store } from '@/store';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);


@observer
export default class PlotlyComponent extends React.Component {

  render () {
    return (
      store.plots.length > 0 && store.plots.map((plot, index) => (
        <Plot
          key={ `${plot?.layout?.title?.text}-${index}` }
          className="w-1/2 h-1/2 mt-10"
          { ...plot }
        />
      ))
    );
  }
}
