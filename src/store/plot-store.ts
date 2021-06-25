import { makeAutoObservable, action } from 'mobx';
import { nanoid } from 'nanoid';
import { GxpPlot, GxpHeatmap } from '@/types/plots';

// Future Workers
import { createHeatmapPlot } from '@/utils/heatmap';

// import { settings } from '@/store/settings';

// import {
//   singleGeneGroupedPlot,
//   multiGeneIndCurvesPlot,
//   stackedLinePlot,
//   multiGeneBarPlot,
//   createPcaPlot,
//   createHeatmapPlot,
//   PlotOptions,
// } from '../utils/plotsHelper';

// import { nanoid } from 'nanoid';
// import { PlotlyOptions } from '@/pages/plots/plots-home';

class PlotStore {
  plots: GxpPlot[] = [];
  _image: string | null = null;

  countUnit: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /* UNIT */

  loadCountUnit(countUnit: string): void {
    this.countUnit = countUnit;
  }

  /* IMAGE */

  get hasImage(): boolean {
    return this.image ? true : false;
  }

  clearImage(): void {
    this._image = null;
  }

  loadImage(image: string): void {
    this._image = image;
  }

  get image(): string | null {
    return this._image;
  }

  /* PLOTS */

  get hasPlots(): boolean {
    return this.plots.length > 0;
  }

  /**
   * Clear the plots array in the store.
   */
  clearPlots(): void {
    this.plots = [];
  }

  deletePlot(key: string): void {
    const index = this.plots.findIndex((plot) => plot.key === key);
    this.plots.splice(index, 1);
  }

  /**
   * Add a new gene expression heatmap plot to the store.
   * @param replicates gene accessions to visualize
   */
  addHeatmapPlot(replicates?: string[]): void {
    const key = nanoid();
    const pendingPlot: GxpPlot = {
      key,
      type: 'heatmap',
      isLoading: true,
    };
    const plotIndex = this.plots.push(pendingPlot) - 1;

    setTimeout(
      () =>
        createHeatmapPlot({ replicates }).then(
          action('addHeatmapPlot', (binData) => {
            const loadedPlot: GxpHeatmap = {
              ...this.plots[plotIndex],
              isLoading: false,
              binData,
            };

            if (this.plots[plotIndex].key === key) {
              this.plots[plotIndex] = loadedPlot;
            }
          })
        ),
      100
    );
  }

  // addBarPlot(accessionIds, options) {
  //   if (accessionIds.length === 1)
  //     this.plots.push(singleGeneGroupedPlot(accessionIds, options));
  //   else if (accessionIds.length > 1)
  //     this.plots.push(multiGeneBarPlot(accessionIds, options));
  // }

  // /**
  //  *
  //  * @param {string[]} accessionIds
  //  * @param {PlotOptions} options
  //  */
  // addIndivualCurvesPlot(accessionIds, options) {
  //   if (accessionIds.length === 1)
  //     this.plots.push(singleGeneGroupedPlot(accessionIds, options));
  //   else if (accessionIds.length > 1)
  //     this.plots.push(multiGeneIndCurvesPlot(accessionIds, options));
  // }

  // /**
  //  *
  //  * @param {string[]} accessionIds
  //  * @param {PlotOptions} options
  //  */
  // addStackedCurvePlot(accessionIds, options) {
  //   this.plots.push(stackedLinePlot(accessionIds, options));
  // }

  /**
   * Generates a plot visualizing the results of a principal component
   * analysis.
   */
  // addPcaPlot() {
  //   this.plots.push(createPcaPlot());
  // }

  /**
   * Generates a plot visualizing the results of a principal component
   * analysis.
   */
  // addHeatmapPlot() {
  //   this.plots.push(createHeatmapPlot());
  // }

  // /**
  //  * @param {Array} accessionIds
  //  * @param {PlotOptions} options
  //  */
  // addPlot(accessionIds, options) {
  //   options.countUnit = settings.gxpSettings.unit;
  //   options.plotId = nanoid();
  //   options.config = this.config(options.plotId);
  //   options.groupOrder = settings.gxpSettings.groupOrder;
  //   options.sampleOrder = settings.gxpSettings.sampleOrder;

  //   switch (options.plotType) {
  //     case 'bars':
  //       this.addBarPlot(accessionIds, options);
  //       break;
  //     case 'individualCurves':
  //       this.addIndivualCurvesPlot(accessionIds, options);
  //       break;
  //     case 'stackedCurves':
  //       this.addStackedCurvePlot(accessionIds, options);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  /**
   * constant config object for plotly
   */
  // config(plotId) {
  //   return {
  //     // responsive: true,
  //     toImageButtonOptions: {
  //       format: 'svg',
  //     },
  //     displaylogo: false,
  //     modeBarButtonsToAdd: [
  //       {
  //         name: 'Delete plot',
  //         icon: {
  //           width: 21,
  //           height: 21,
  //           path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  //         },
  //         click: () => {
  //           this.deletePlot(plotId);
  //         },
  //       },
  //     ],
  //   };
  // }
}

export const plotStore = new PlotStore();
