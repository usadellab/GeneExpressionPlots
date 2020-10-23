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
          className="relative w-1/2 h-1/2 mt-10 flex flex-col"
          plot={{...plot}}
          showCaption={plot.showCaption}
          accession={plot.accession}
          caption={store.descriptions[plot.accession]}
        />
      ))
    );
  }
}
