
import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default class PlotlyPlot extends React.Component {

  componentDidMount () {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        window.Plotly.Plots.resize(entry.target);
      }
    });
    this.resizeObserver.observe(this.plot.el);
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.plot.el);
  }

  render () {
    return (
      <figure className={this.props.className} >
        <Plot
          ref={ ref => this.plot = ref }
          { ...this.props.plot }
        />
        <div className="flex flex-wrap">
          { this.props.children }
        </div>
      </figure>
    );
  }
}
