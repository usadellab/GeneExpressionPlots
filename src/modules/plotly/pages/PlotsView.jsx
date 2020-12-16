import React from 'react';
import { observer } from 'mobx-react';
import PlotlyPlot from '../components/PlotlyPlot';
import PlotCaption from '../components/PlotCaption';

import { store } from '@/store';
import { plotStore } from '@/store/plot-store';
@observer
export default class PlotsView extends React.Component {
  render() {
    return (
      plotStore.plots.length > 0 &&
      plotStore.plots.map(plot => (
        <PlotlyPlot
          key={plot.plotId}
          className="relative flex flex-col m-3 py-6 w-full resize-x
                     shadow-outer overflow-auto bg-white"
          plot={{ ...plot }}
        >
          {
            plot.showCaption &&
            plot.accessions.map(accession => (
              <PlotCaption
                key={ accession }
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
