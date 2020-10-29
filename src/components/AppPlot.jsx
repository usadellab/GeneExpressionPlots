
import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default class PlotlyComponent extends React.Component {
  render () {
    return (
      <figure
        className={this.props.className}
      >
        <Plot
          { ...this.props.plot }
        />
        {
          this.props.showCaption &&
          <figcaption className="px-20 text-justify text-gray-800 text-sm">
            <span className="font-semibold">{this.props.accession}</span>
            {`: ${this.props.caption ? this.props.caption : 'no gene caption available'}`}
          </figcaption>
        }
      </figure>
    );
  }
}
