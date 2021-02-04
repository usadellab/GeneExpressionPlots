import React from 'react';

import GeneCard from '@/components/cards/GeneCard';
import { PlotContext } from './PlotlyPlot';

export default class PlotCaption extends React.Component {
  render() {
    return (
      <PlotContext.Consumer>
        {({ hoveredGene }) => (
          <figcaption
            className={`flex flex-col py-5 mt-2 mx-8
                 border-t-2 hover:border-yellow-600
                 hover:bg-yellow-100
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
                 text-justify text-gray-800 text-sm`}
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
