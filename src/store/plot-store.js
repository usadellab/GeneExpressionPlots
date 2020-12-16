import {
  makeAutoObservable,
} from 'mobx';

import {
  singleGeneGroupedPlot,
  multiGeneIndCurvesPlot,
  stackedLinePlot,
  multiGeneBarPlot,
} from '../utils/plotsHelper';

class PlotStore {
  
  plots = [];
  
  constructor () {
    makeAutoObservable(this);
  }
  
  hasPlots () {
    return this.plots.length > 0;
  }
  
  /**
   * Clear the plots array in the store.
   */
  clearPlots () {
    this.plots = [];
  }
  
  /**
   * Delete a plot from the store
   * @param {number} index plot index in the store
   */
  deletePlot(index){
    this.plots.splice(index,1);
  }

  /**
   * 
   * @param {string[]} accessionIds 
   * @param {PlotOptions} options 
   */
  addBarPlot(accessionIds, options) {

    if (accessionIds.length === 1) this.plots.push(
      singleGeneGroupedPlot(accessionIds, options)
    );
    else if (accessionIds.length > 1) this.plots.push(
      multiGeneBarPlot(accessionIds, options)
    );
  }

  /**
   * 
   * @param {string[]} accessionIds 
   * @param {PlotOptions} options 
   */
  addIndivualCurvesPlot(accessionIds, options) {
    if (accessionIds.length === 1) this.plots.push(
      singleGeneGroupedPlot(accessionIds, options)
    );
    else if (accessionIds.length > 1) this.plots.push(
      multiGeneIndCurvesPlot(accessionIds, options)
    );
  }

  /**
   * 
   * @param {string[]} accessionIds 
   * @param {PlotOptions} options 
   */
  addStackedCurvePlot(accessionIds, options) {
    this.plots.push(
      stackedLinePlot(accessionIds, options)
    );
  }

  /**
   * 
   * @typedef  {Object}   PlotOptions
   * @property {boolean} showlegend
   * @property {boolean} showCaption
   * @property {string}  plotType
   * @property {string}  colorBy
   * @property {string}  plotTitle
   * 
   * @param {Array} accessionIds 
   * @param {PlotOptions} options 
   */
  addPlot(accessionIds, options){
    options.config = this.config(this.plots.length);
    switch (options.plotType) {
      case 'bars':
        this.addBarPlot(accessionIds, options);
        break;
      case 'individualCurves':
        this.addIndivualCurvesPlot(accessionIds, options);
        break;
      case 'stackedCurves':
        this.addStackedCurvePlot(accessionIds, options);
        break;
      default:
        break;
    }
  }


  /**
   * constant config object for plotly
   */
  config(index){
    return {
      responsive: true,
      toImageButtonOptions: {
        format: 'svg'
      },
      displaylogo: false,
      modeBarButtonsToAdd: [
        {
          name: 'Delete plot',
          icon: {
            'width': 21,
            'height': 21,
            'path': 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
          },
          click: function() {
            plotStore.deletePlot(index);
          }
        }
      ]
    };
  }
}

export const plotStore = new PlotStore();