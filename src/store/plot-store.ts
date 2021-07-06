import { makeAutoObservable, action } from 'mobx';
import { nanoid } from 'nanoid';
import {
  GxpHeatmap,
  GxpPlot,
  PlotlyOptions,
  GxpPlotly,
  GxpPCA,
  GxpImage,
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

  get hasPlots(): boolean {
    return this.plots.length > 0;
  }

  get image(): string | null {
    return this._image;
  }

  /**
   * Clear the plots array in the store.
   */
  clearPlots(): void {
    this.plots = [];
  }

  /**
   * Remove a single plot from the store.
   * @param id plot id
   */
  deletePlot(id: string): void {
    const index = this.plots.findIndex((plot) => plot.id === id);
    if (index > -1) {
      const plot = this.plots[index];
      if (plot.type === 'image') {
        const gxpImage = plot as GxpImage;
        URL.revokeObjectURL(gxpImage.src);
      }
      this.plots.splice(index, 1);
    }
  }

  /**
   * Add a new gene expression heatmap plot to the store.
   * @param replicates gene accessions to visualize
   */
  addHeatmapPlot(plotTitle?: string, replicates?: string[]): void {
    const id = nanoid();
    const pendingPlot: GxpPlot = {
      id,
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

            if (this.plots[plotIndex].id === id) {
              this.plots[plotIndex] = loadedPlot;
            }
          })
        ),
      100
    );
  }

  addImagePlot(url: string, alt: string): void {
    const image: GxpImage = {
      alt,
      id: nanoid(),
      isLoading: false,
      type: 'image',
      src: url,
    };

    this.plots.push(image);
  }

  addPCAPlot(plotTitle?: string): void {
    const id = nanoid();
    const pendingPlot: GxpPlot = {
      id,
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

            if (this.plots[plotIndex].id === id) {
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
      id: nanoid(),
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
      id: nanoid(),
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
      id: nanoid(),
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
      id: nanoid(),
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
      id: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(stackedLines);
  }
}

export const plotStore = new PlotStore();
