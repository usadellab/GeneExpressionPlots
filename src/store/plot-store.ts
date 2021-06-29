import { makeAutoObservable, action } from 'mobx';
import { nanoid } from 'nanoid';
import {
  GxpHeatmap,
  GxpPlot,
  PlotlyOptions,
  GxpPlotly,
  GxpPCA,
} from '@/types/plots';

// Future Workers
import { createHeatmapPlot } from '@/utils/plots/heatmap';
import multiGeneBarData from '@/utils/plots/multi-gene-bar';
import multiGeneIndividualLinesData from '@/utils/plots/multi-gene-individual-lines';
import singleGeneIndividualLinesData from '@/utils/plots/single-gene-individual-lines';
import singleGeneBarData from '@/utils/plots/single-gene-bar';
import stackedLinesData from '@/utils/plots/stacked-lines';
import pcaData from '@/utils/plots/pca';

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
  addHeatmapPlot(plotTitle?: string, replicates?: string[]): void {
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
          action('addHeatmapPlot', (heatmapData) => {
            const loadedPlot: GxpHeatmap = {
              ...this.plots[plotIndex],
              isLoading: false,
              binData: heatmapData.bins,
              tree: heatmapData.tree,
              plotTitle,
            };

            if (this.plots[plotIndex].key === key) {
              this.plots[plotIndex] = loadedPlot;
            }
          })
        ),
      100
    );
  }

  addPCAPlot(plotTitle?: string): void {
    const key = nanoid();
    const pendingPlot: GxpPlot = {
      key,
      type: 'pca',
      isLoading: true,
    };
    const plotIndex = this.plots.push(pendingPlot) - 1;

    setTimeout(
      () =>
        pcaData(plotTitle).then(
          action('addPCAPlot', (pcaData) => {
            const loadedPlot: GxpPCA = {
              ...this.plots[plotIndex],
              ...pcaData,
              isLoading: false,
            };

            if (this.plots[plotIndex].key === key) {
              this.plots[plotIndex] = loadedPlot;
            }
          })
        ),
      100
    );
  }

  addSingleGeneBarPlot(accessions: string[], options: PlotlyOptions): void {
    const data = singleGeneBarData(accessions[0], options);
    const singleGeneBarPlot: GxpPlotly = {
      key: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(singleGeneBarPlot);
  }

  addMultiGeneBarPlot(accessions: string[], options: PlotlyOptions): void {
    const data = multiGeneBarData(accessions, options);
    const multiGeneBarPlot: GxpPlotly = {
      key: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(multiGeneBarPlot);
  }

  addSingleGeneIndividualLinesPlot(
    accessions: string[],
    options: PlotlyOptions
  ): void {
    const data = singleGeneIndividualLinesData(accessions[0], options);
    const singleGeneIndividualLines: GxpPlotly = {
      key: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(singleGeneIndividualLines);
  }

  addMultiGeneIndividualLinesPlot(
    accessions: string[],
    options: PlotlyOptions
  ): void {
    const data = multiGeneIndividualLinesData(accessions, options);
    const multiGeneIndividualLines: GxpPlotly = {
      key: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(multiGeneIndividualLines);
  }

  addStackedLinesPlot(accessions: string[], options: PlotlyOptions): void {
    const data = stackedLinesData(accessions, options);
    const stackedLines: GxpPlotly = {
      key: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(stackedLines);
  }

  /**
   * Generates a plot visualizing the results of a principal component
   * analysis.
   */
  // addPcaPlot() {
  //   this.plots.push(createPcaPlot());
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
