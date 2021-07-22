import { makeAutoObservable } from 'mobx';
import {
  EnrichmentAnalysis,
  EnrichmentAnalysisOptions,
} from '@/types/enrichment';
import { nanoid } from 'nanoid';
import {
  getSelectorFunction,
  runEnrichmentAnalysis,
  test_for_enrichment,
} from '@/utils/enrichment_analysis';
import { infoTable } from './data-store';
import fishersExactTest from '@/utils/fishers-exact-test';

class EnrichmentStore {
  analyses: EnrichmentAnalysis[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getAnalysisById(id: string): EnrichmentAnalysis | undefined {
    return this.analyses.find((analysis) => analysis.id === id);
    // if (found) return found;
    // else throw new Error(`No enrichment analysis found with id ${id}`);
  }

  /**
   * Clear the analyses array in the store.
   */
  clearAnalyses(): void {
    this.analyses = [];
  }

  /**
   * Remove a single plot from the store.
   * @param id plot id
   */
  deleteAnalysis(id: string): void {
    const index = this.analyses.findIndex((analysis) => analysis.id === id);
    if (index > -1) {
      this.analyses.splice(index, 1);
    }
  }

  addAnalysis(analysis: EnrichmentAnalysis): void {
    this.analyses.push(analysis);
  }

  addEnrichmentAnalysis(options: EnrichmentAnalysisOptions): void {
    // const data: (string | number)[][] = [
    //   ['P001', 0.05, 0.1],
    //   ['P002', 0.05, 0.1],
    //   ['P003', 0.05, 0.1],
    // ];

    console.log({ options });

    const TEFcolIndex =
      infoTable.colNames.findIndex((col) => col === options.TEFcolumn) + 1;
    console.log({ TEFcolIndex });
    const TEIcolIndex =
      infoTable.colNames.findIndex((col) => col === options.TEIcolumn) + 1;

    // const r = fishersExactTest(0, 15, 13, 10000);
    // console.log({ r });
    const data = runEnrichmentAnalysis(
      infoTable.rows,
      options,
      TEFcolIndex,
      TEIcolIndex
    );
    console.log({ data });
    // this.analyses.push({ id: nanoid(), data, ...options });
  }
}

export const enrichmentStore = new EnrichmentStore();
