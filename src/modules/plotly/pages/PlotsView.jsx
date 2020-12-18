import React        from 'react';
import { observer } from 'mobx-react';

import PlotlyPlot  from '../components/PlotlyPlot';
import PlotCaption from '../components/PlotCaption';

import { plotStore } from '@/store/plot-store';
import { infoTable } from '@/store/data-store';
import { colors }    from '@/utils/plotsHelper';

@observer
export default class PlotsView extends React.Component {

  render() {
    return (
      plotStore.plots.map(plot => (
        <PlotlyPlot
          key={plot.plotId}
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
                caption={ infoTable.getRowAsMap(accession) }
                color={ plot.accessions.length > 1  ? colors[index] : null }
              />
            ))
          }
        </PlotlyPlot>
      ))
    );
  }
}
