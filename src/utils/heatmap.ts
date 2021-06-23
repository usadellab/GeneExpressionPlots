import { distance } from 'ml-distance';
import getDistanceMatrix from 'ml-distance-matrix';
import { AgglomerationMethod, agnes, Cluster } from 'ml-hclust';
import { Bin, Bins } from '@visx/mock-data/lib/generators/genBins';

// Once a worker, data will be accessed via IndexedDb
import { dataTable } from '@/store/data-store';

//#region PRIVATE API

type DistanceMethod =
  | 'additiveSymmetric'
  | 'avg'
  | 'bhattacharyya'
  | 'canberra'
  | 'chebyshev'
  | 'clark'
  | 'czekanowski'
  | 'dice'
  | 'divergence'
  | 'euclidean'
  | 'fidelity'
  | 'gower'
  | 'harmonicMean'
  | 'hellinger'
  | 'innerProduct'
  | 'intersection'
  | 'jaccard'
  | 'jeffreys'
  | 'jensenDifference'
  | 'jensenShannon'
  | 'kdivergence'
  | 'kulczynski'
  | 'kullbackLeibler'
  | 'kumarHassebrook'
  | 'kumarJohnson'
  | 'lorentzian'
  | 'manhattan'
  | 'matusita'
  | 'minkowski'
  | 'motyka'
  | 'neyman'
  | 'pearson'
  | 'probabilisticSymmetric'
  | 'ruzicka'
  | 'soergel'
  | 'sorensen'
  | 'squared'
  | 'squaredChord'
  | 'squaredEuclidean'
  | 'taneja'
  | 'tanimoto'
  | 'topsoe'
  | 'waveHedges';

/**
 * Compute a gene expression distance matrix using the given algorithm
 * @param matrix a matrix of gene counts per replicate
 * @returns the computed euclidean distance matrix
 */
function computeGeneXDistance(
  matrix: number[][],
  method: DistanceMethod
): number[][] {
  const distanceMatrix = getDistanceMatrix(matrix, distance[method]);
  return distanceMatrix;
}

/**
 * Cluster a distance matrix of replicate gene expression values using the
 * AGNES algorithm between the expression vectors.
 *
 * @param matrix pre-computed gene expression distance matrix
 * @param method agglomeration method
 * @returns the clustering result in tree format as an instance of ml-hclust's Cluster class
 */
function clusterGeneXMatrix(
  matrix: number[][],
  method: AgglomerationMethod
): Cluster {
  const tree = agnes(matrix, {
    isDistanceMatrix: true,
    method,
  });
  return tree;
}

/**
 * Transform an array of numeric values into a Bins type from '@visx/heatmap'.
 * @param values numeric array to transform
 * @param index current bins index
 * @returns the number array transformed as a bin
 */
function valuesToBins(values: number[], index: number): Bins {
  const bin = index;
  const bins: Bin[] = values.map((count, bin) => ({ bin, count }));

  return {
    bin,
    bins,
  };
}

//#endregion

//#region PUBLIC API

export async function createHeatmapPlot(accessions: string[]): Promise<Bins[]> {
  // Prepare the data from the store
  const replicateCounts: number[][] = dataTable.toTransposed2dArray();

  // Compute the euclidean distance matrix between each gene
  const distanceMatrix = computeGeneXDistance(replicateCounts, 'euclidean');

  // Transform results to be consumed by @visx/heatmap
  const binData = distanceMatrix.map(valuesToBins);

  return binData;
}

//#endregion
