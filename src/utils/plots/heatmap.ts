import { distance } from 'ml-distance';
import getDistanceMatrix from 'ml-distance-matrix';
import { AgglomerationMethod, agnes, Cluster } from 'ml-hclust';
import { nanoid } from 'nanoid';
import { ClusterTree, HeatmapBins } from '@/types/plots';

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
 * Higher-order mapping function to transform an array of numeric values into a
 * Bins type ready to be consumed by the `HeatmapPlot` component built with the
 * API of '@visx/heatmap'.
 * @param rowNames
 * @param values numeric array to transform
 * @param index current bins index
 * @returns the number array transformed as a bin
 */
function matrixToBins(colNames: string[], rowNames: string[]) {
  return (values: number[], index: number): HeatmapBins => {
    const bin = colNames[index];
    const bins = values.map((count, accessionIndex) => ({
      bin: rowNames[accessionIndex],
      count,
    }));

    return {
      bin,
      bins,
    };
  };
}

/**
 * Traverses the argument tree in a recursive approach converting each node to
 * an object with at most two properties 'name' of type array and 'children'
 * also of type array.
 *
 * @param cluster an instance ml-hclust Cluster object
 * @param leafNames array of original leaf names
 * @returns the cluster tree represenation
 */
export function clusterToTree(
  cluster: Cluster,
  leafNames: string[]
): ClusterTree {
  if (cluster.isLeaf) {
    return {
      name: leafNames[cluster.index],
    };
  } else {
    const name = nanoid();
    const children = cluster.children.map((c) => clusterToTree(c, leafNames));
    return {
      name,
      children,
    };
  }
}

/**
 * Get the names of the clustered tree leave nodes.
 * @param cluster an instance of ml-hclust's Cluster class
 * @param srcNames node names in pre-clustering order
 * @returns an array with the cluster tree leaves
 */
function getTreeLeaves(cluster: Cluster, srcNames: string[]): string[] {
  if (cluster.isLeaf) {
    return [srcNames[cluster.index]];
  } else {
    const index = cluster.children.reduce((accumulator, clusterChild) => {
      const leaves = getTreeLeaves(clusterChild, srcNames);
      accumulator.push(...leaves);
      return accumulator;
    }, [] as string[]);

    return index;
  }
}

/**
 * Sort a given matrix columns to match the cluster leaves order.
 * @param matrix source distance matrix
 * @param cluster clustered matrix as an instance of ml-hclust's Cluster
 * @returns the sorted matrix
 */
function sortClusteredMatrix(matrix: number[][], cluster: Cluster): number[][] {
  if (cluster.isLeaf) {
    return [matrix[cluster.index]];
  } else {
    const index = cluster.children.reduce((accumulator, clusterChild) => {
      const matrixCol = sortClusteredMatrix(matrix, clusterChild);
      accumulator.push(...matrixCol);
      return accumulator;
    }, [] as number[][]);

    return index;
  }
}

//#endregin

//#region PUBLIC API

interface CreateHeatmapOptions {
  replicates?: string[];
}

export async function createHeatmapPlot(
  options?: CreateHeatmapOptions
): Promise<{
  bins: HeatmapBins[];
  tree: ClusterTree;
}> {
  // Prepare the data from the store
  const replicateCounts: number[][] = dataTable.toArrayOfColumns(
    options?.replicates
  );

  const srcReplicateNames = options?.replicates?.length
    ? options.replicates
    : dataTable.colNames;

  // Compute the euclidean distance matrix between each gene
  const distanceMatrix = computeGeneXDistance(replicateCounts, 'euclidean');

  // Cluster the gene matrix
  const cluster = clusterGeneXMatrix(distanceMatrix, 'ward');
  const tree = clusterToTree(cluster, srcReplicateNames);

  // Sort the matrix and transform the data to be consumed by @visx/heatmap
  const sortedReplicateNames = getTreeLeaves(cluster, srcReplicateNames);
  const sortedMatrix = sortClusteredMatrix(distanceMatrix, cluster);
  const bins = sortedMatrix.map(
    matrixToBins(sortedReplicateNames, srcReplicateNames)
  );

  return {
    bins,
    tree,
  };
}

//#endregion
