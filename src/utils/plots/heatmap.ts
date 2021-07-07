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
 * Higher-order mapping function to transform an array of numeric values into a
 * Bins type ready to be consumed by the `HeatmapPlot` component built with the
 * API of '@visx/heatmap'.
 * @param values numeric array to transform
 * @param index current bins index
 * @returns the number array transformed as a bin
 */
type BinsMapFunction = (values: number[], index: number) => HeatmapBins;
/**
 * Higher-order mapping function to transform an array of numeric values into a
 * Bins type ready to be consumed by the `HeatmapPlot` component built with the
 * API of '@visx/heatmap'.
 * @param srcNames source matrix column and row names
 */
export function matrixToBins(srcNames: string[]): BinsMapFunction;
/**
 * Higher-order mapping function to transform an array of numeric values into a
 * Bins type ready to be consumed by the `HeatmapPlot` component built with the
 * API of '@visx/heatmap'.
 * @param colNames source matrix column names
 * @param rowNames source matrix row names
 */
export function matrixToBins(
  colNames: string[],
  rowNames: string[]
): BinsMapFunction;
export function matrixToBins(colNames: string[], rowNames?: string[]) {
  return (values: number[], index: number): HeatmapBins => {
    const bin = colNames[index];
    const bins = values.map((count, accessionIndex) => ({
      bin: rowNames ? rowNames[accessionIndex] : colNames[accessionIndex],
      count,
    }));

    return {
      bin,
      bins,
    };
  };
}

/**
 * Traverse the argument tree in a recursive approach converting each node to
 * an object of nodes and children.
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
 * Get source indexes of the clustered tree leave nodes.
 * @param cluster an instance of ml-hclust's Cluster class
 * @returns an array with the cluster tree leaves
 */
export function getTreeLeaves(cluster: Cluster): number[];
/**
 * Get the names of the clustered tree leave nodes.
 * @param cluster an instance of ml-hclust's Cluster class
 * @param srcNames node names in pre-clustering order
 * @returns an array with the cluster tree leaves
 */
export function getTreeLeaves(
  cluster: Cluster,
  srcNames: string[]
): Record<string, number>;
export function getTreeLeaves(
  cluster: Cluster,
  srcNames?: string[]
): number[] | Record<string, number> {
  if (cluster.isLeaf) {
    return srcNames
      ? { [srcNames[cluster.index]]: cluster.index }
      : [cluster.index];
  } else {
    if (srcNames) {
      const index = cluster.children.reduce((accumulator, clusterChild) => {
        const leaves = getTreeLeaves(clusterChild, srcNames);
        return { ...accumulator, ...leaves };
      }, {} as Record<string, number>);
      return index;
    } else {
      const index = cluster.children.reduce((accumulator, clusterChild) => {
        const leaves = getTreeLeaves(clusterChild);
        accumulator.push(...leaves);
        return accumulator;
      }, [] as number[]);
      return index;
    }
  }
}

/**
 * Sort a numeric matrix according to a new order of columns and rows.
 * @param matrix matrix to be sorted
 * @param sortIndex new indexes for rows and columns
 * @returns the sorted matrix
 */
export function sortClusteredMatrix(
  matrix: number[][],
  sortIndex: number[]
): number[][];
/**
 * Sort a numeric matrix according to a new order of columns and rows.
 * @param matrix  matrix to be sorted
 * @param colOrder new index order for the columns
 * @param rowsOrder new index order for the rows
 * @returns the sorted matrix
 */
export function sortClusteredMatrix(
  matrix: number[][],
  colOrder: number[],
  rowsOrder: number[]
): number[][];
export function sortClusteredMatrix(
  matrix: number[][],
  colsOrder: number[],
  rowOrder?: number[]
): number[][] {
  const sortedMatrix = colsOrder.map((colIndex) => {
    const matrixCol = matrix[colIndex];
    const sortedCol = rowOrder
      ? rowOrder.map((rowIndex) => matrixCol[rowIndex])
      : colsOrder.map((rowIndex) => matrixCol[rowIndex]);
    return sortedCol;
  });
  return sortedMatrix;
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

  // Sort the matrix according to the cluster tree
  const sortedCols = getTreeLeaves(cluster, srcReplicateNames);
  const sortedMatrix = sortClusteredMatrix(
    distanceMatrix,
    Object.values(sortedCols)
  );

  // Transform the matrix data to be consumed by @visx/heatmap
  const bins = sortedMatrix.map(matrixToBins(Object.keys(sortedCols)));

  return {
    bins,
    tree,
  };
}

//#endregion
