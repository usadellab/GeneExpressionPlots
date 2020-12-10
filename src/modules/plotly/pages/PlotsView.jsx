import React from 'react';
import { observer } from 'mobx-react';
import AppPlot from '@components/AppPlot';

import { store } from '@/store';

@observer
export default class PlotlyComponent extends React.Component {
  render() {
    return (
      store.plots.length > 0 &&
      store.plots.map((plot, index) => (
        <AppPlot
          key={`${plot?.layout?.title?.text}-${index}`}
          className="relative flex flex-col m-3 py-6 w-full resize-x shadow-outer overflow-auto bg-white"
          plot={{ ...plot }}
          showCaption={plot.showCaption}
          accessions={plot.accessions}
          captions={plot.accessions.map((accession) => {
            return store.captions[accession]
              ? store.captions[accession]
              : 'no gene caption available';
          })}
        />
      ))
    );
  }
}
