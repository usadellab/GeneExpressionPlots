import React from 'react';
import { observer } from 'mobx-react';
import PlotlyPlot from '../components/PlotlyPlot';
import PlotCaption from '../components/PlotCaption';

import { store } from '@/store';

@observer
export default class PlotsView extends React.Component {
  render() {
    return (
      store.plots.length > 0 &&
      store.plots.map((plot, index) => (
        <PlotlyPlot
          key={`${plot?.layout?.title?.text}-${index}`}
          className="relative flex flex-col m-3 py-6 w-full resize-x
                     shadow-outer overflow-auto bg-white"
          plot={{ ...plot }}
        >
          {
            plot.showCaption &&
            plot.accessions.map((accession, index) => (
              <PlotCaption
                key={ `accession-${index}` }
                accession={ accession }
                caption={ store.getCaption(accession) }
              />
            ))
          }
        </PlotlyPlot>
      ))
    );
  }
}
