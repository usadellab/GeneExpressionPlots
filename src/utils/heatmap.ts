import { distance } from 'ml-distance';
import getDistanceMatrix from 'ml-distance-matrix';
import { AgglomerationMethod, agnes, Cluster } from 'ml-hclust';
import { Bin, Bins } from '@visx/mock-data/lib/generators/genBins';

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
export function computeGeneXDistance(
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
export function clusterGeneXMatrix(
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
export function valuesToBins(values: number[], index: number): Bins {
  const bin = index;
  const bins: Bin[] = values.map((count, bin) => ({ bin, count }));

  return {
    bin,
    bins,
  };
}
