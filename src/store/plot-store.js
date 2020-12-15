import {
  makeAutoObservable,
} from 'mobx';

import {
  computeAveragesAndVariances,
  createGroupPlot,
  createMultiGeneBarPlot,
  createStackedLinePlot
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
   * @param {boolean} showlegend
   * @param {string} plotType
   */
  addBarPlot(accessionIds, showlegend, showCaption, plotTitle) {
    
    let plotData = computeAveragesAndVariances(this.groups, accessionIds);

    if (accessionIds.length === 1) this.plots.push(
      createGroupPlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        'bar',
        this.plots.length,
        plotTitle,
      )
    );
    else if (accessionIds.length > 1) this.plots.push(
      createMultiGeneBarPlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        this.plots.length,
        plotTitle,
      )
    );

  }

  addIndivualCurvesPlot(accessionIds, showlegend, showCaption, plotTitle) {
    let plotData = computeAveragesAndVariances(this.groups, accessionIds);
    this.plots.push(
      createGroupPlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        'scatter',
        this.plots.length,
        plotTitle,
      )
    );
  }

  addStackedCurvePlot(accessionIds, showlegend, showCaption, colorBy, plotTitle) {
    let plotData = computeAveragesAndVariances(this.groups, accessionIds);
    this.plots.push(
      createStackedLinePlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        this.plots.length,
        colorBy,
        plotTitle,
      )
    );
  }

  addPlot(accessionIds, showlegend, showCaption, plotType, colorBy, plotTitle){

    switch (plotType) {
      case 'bars':
        this.addBarPlot(accessionIds, showlegend, showCaption, plotTitle);
        break;
      case 'individualCurves':
        this.addIndivualCurvesPlot(accessionIds, showlegend, showCaption, plotTitle);
        break;
      case 'stackedCurves':
        this.addStackedCurvePlot(accessionIds, showlegend, showCaption, colorBy, plotTitle);
        break;
      default:
        break;
    }
  }


}