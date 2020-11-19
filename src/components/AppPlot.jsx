
import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

class AppPlotCaption extends React.Component {
  render() {
    return (
      <li>
        <span className="font-semibold">{this.props.accession}</span>
        <span className="ml-2">{this.props.caption}</span>
      </li>
    );
  }
}

export default class PlotlyComponent extends React.Component {

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
        {
          this.props.showCaption &&
          <figcaption className="px-20 text-justify text-gray-800 text-sm">
            <ul>
              {
                this.props.accessions.map( (accession, index) =>(
                  <AppPlotCaption accession={accession} key={index} caption={this.props.captions[index]}/>
                ))
              }
            </ul>
            {/* <span className="font-semibold">{this.props.accession}</span>
            {`: ${this.props.caption ? this.props.caption : 'no gene caption available'}`} */}
          </figcaption>
        }
      </figure>
    );
  }
}
