import React from 'react';

import GeneCard from '@/components/cards/GeneCard';
import { PlotContext } from './PlotlyPlot';

export default class PlotCaption extends React.Component {
  render() {
    return (
      <PlotContext.Consumer>
        {({ hoveredGene }) => (
          <figcaption
            className={`
                 flex py-5
                 hover:bg-yellow-100 odd:bg-gray-100
                 text-justify text-gray-800 text-sm ${
          this.props.className ?? ''
          }
                 ${
          hoveredGene && !hoveredGene.includes(this.props.accession)
            ? 'opacity-50'
            : ''
          }
                 ${
          hoveredGene.includes(this.props.accession)
            ? 'bg-yellow-100'
            : ''
          }
                 `}
            style={{ borderColor: this.props.color ?? '' }}
          >
            <GeneCard
              className="px-2"
              accession={this.props.accession}
              geneInfo={this.props.caption}
              color={this.props.color}
            />
          </figcaption>
        )}
      </PlotContext.Consumer>
    );
  }
}
