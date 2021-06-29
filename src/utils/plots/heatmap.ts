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
 * @param replNames
 * @param values numeric array to transform
 * @param index current bins index
 * @returns the number array transformed as a bin
 */
function valuesToBins(replNames: string[]) {
  return (values: number[], index: number): HeatmapBins => {
    const bin = replNames[index];
    const bins = values.map((count, accessionIndex) => ({
      bin: replNames[accessionIndex],
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
 * @param clstr an instance ml-hclust Cluster object
 * @param leafNames array of original leaf names
 * @returns the cluster tree represenation
 */
export function clusterToTree(
  clstr: Cluster,
  leafNames: string[]
): ClusterTree {
  if (clstr.isLeaf) {
    return {
      name: leafNames[clstr.index],
    };
  } else {
    const name = nanoid();
    const children = clstr.children.map((c) => clusterToTree(c, leafNames));
    return {
      name,
      children,
    };
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

  const replicateNames = options?.replicates?.length
    ? options.replicates
    : dataTable.colNames;

  // Compute the euclidean distance matrix between each gene
  const distanceMatrix = computeGeneXDistance(replicateCounts, 'euclidean');

  // Cluster the gene matrix
  const cluster = clusterGeneXMatrix(distanceMatrix, 'ward');
  const tree = clusterToTree(cluster, replicateNames);

  // Transform results to be consumed by @visx/heatmap
  const bins = distanceMatrix.map(valuesToBins(replicateNames));

  return {
    bins,
    tree,
  };
}

//#endregion
