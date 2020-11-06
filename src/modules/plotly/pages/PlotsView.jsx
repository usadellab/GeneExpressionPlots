import React from 'react';
import { observer } from 'mobx-react';
import AppPlot from '@components/AppPlot';

import { store } from '@/store';


@observer
export default class PlotlyComponent extends React.Component {

  render () {
    return (
      store.plots.length > 0 && store.plots.map((plot, index) => (
        <AppPlot
          key={ `${plot?.layout?.title?.text}-${index}` }
          className="relative flex flex-col mt-10 w-full xl:w-1/2 xl:h-1/2"
          plot={{...plot}}
          showCaption={plot.showCaption}
          accessions={plot.accessions}
          captions={plot.accessions.map(accession => {
            return store.captions[accession] ? store.captions[accession] : 'no gene caption available';
          })}
        />
      ))
    );
  }
}
