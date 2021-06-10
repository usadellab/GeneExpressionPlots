import React, { createContext } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export const PlotContext = createContext({ hoveredGene: '' });

export default class PlotlyPlot extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
    };
  }

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        Plotly.Plots.resize(entry.target);
      }
    });
    this.resizeObserver.observe(this.plot.el);
  }

  componentWillUnmount() {
    this.resizeObserver.unobserve(this.plot.el);
  }

  onPlotHover = (plotObject) => {
    const { points } = plotObject;
    if (points.length !== 1 || this.props.plot.accessions?.length <= 1) return;
    const name = points[0].fullData.name;
    this.setState({ name });
  };

  onPlotUnhover = () => {
    this.setState({ name: '' });
  };

  render() {
    return (
      <PlotContext.Provider value={{ hoveredGene: this.state.name }}>
        <figure className={this.props.className}>
          <Plot
            onHover={this.onPlotHover}
            onUnhover={this.onPlotUnhover}
            ref={(ref) => (this.plot = ref)}
            {...this.props.plot}
          />
          <div className="mx-12">{this.props.children}</div>
        </figure>
      </PlotContext.Provider>
    );
  }
}
