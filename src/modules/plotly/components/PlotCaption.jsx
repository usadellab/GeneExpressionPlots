import React from 'react';

import { PlotContext } from './PlotlyPlot';

export default class PlotCaption extends React.Component {
  render() {
    return (
      <PlotContext.Consumer>
        {
          ({ hoveredGene }) => (
            <figcaption
              className={
                `flex flex-col py-5 mt-2
                 border-t-2 hover:border-yellow-600
                 hover:bg-yellow-100
                 ${hoveredGene && !hoveredGene.includes(this.props.accession) ? 'opacity-50' : ''}
                 ${hoveredGene.includes(this.props.accession) ? 'bg-yellow-100' : ''}
                 text-justify text-gray-800 text-sm`
              }
              style={{ borderColor: this.props.color ?? '' }}
            >

              <div
                className="font-semibold text-base"
                style={{ color: this.props.color ?? '' }}
              >
                { this.props.accession }
              </div>

              <div className="flex items-center mt-2">

                <div>
                  {
                    [ ...this.props.caption.keys() ].map(colName => (
                      <div
                        key={ colName }
                        className="ml-2 py-1 uppercase text-yellow-700"
                      >
                        { colName }
                      </div>
                    ))
                  }
                </div>

                <div>
                  {
                    [ ...this.props.caption.values() ].map((cellValue, index) => (
                      <div key={ index } className="ml-5 py-1">
                        { cellValue }
                      </div>
                    ))
                  }
                </div>

              </div>
            </figcaption>
          )
        }
      </PlotContext.Consumer>
    );
  }
}
