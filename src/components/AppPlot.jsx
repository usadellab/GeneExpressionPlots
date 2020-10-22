
import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

import { store } from '@/store';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);


export default class PlotlyComponent extends React.Component {
  render () {
    return (
      <figure
        className={this.props.className}
      >
        <Plot
          // className="w-full h-full"
          { ...this.props.plot }
        />
        {
          this.props.showCaption &&
          <figcaption className="px-24 text-justify text-gray-800">
            <span className="font-semibold">{this.props.plot.caption}</span>
            {`: ${store.descriptions[this.props.plot.caption]}`}
          </figcaption>
        }
      </figure>
    );
  }
}
