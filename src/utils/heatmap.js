import { agnes } from 'ml-hclust';
import getDistanceMatrix from 'ml-distance-matrix';
import {
  euclidean
} from 'ml-distance-euclidean';

/**
 * Clusters the gene expression values belonging to the replicates (columns) of
 * the argument data frame using the AGNES method and euclidean distance
 * between the expression vectors.
 *
 * @param {object} dataframe - An instance of Dataframe holding gene expression
 * value vectors (columns) for different samples (replicates).
 *
 * @return {object} A plain old javascript object with two properties: the
 * distance matrix and the clustering result in tree format. The latter is an
 * instance of ml-hclust's Cluster class.
 */
export function clusterExpressionReplicates(dataframe) {
  let arrOfReplicates = dataframe.toTransposed2dArray();
  let distanceMatrix = getDistanceMatrix(arrOfReplicates, euclidean)
  let tree = agnes(distanceMatrix, {
    method: 'ward',
    isDistanceMatrix: true
  });
  return {
    distanceMatrix,
    tree
  }
}

/**
 * Recursive function that returns the leaf index identifiers of an instance of
 * class Cluster. If the argument `clstr` is a leaf, the respective index of
 * the data vector (column) in the original 'dataframe' is returned, if the
 * argument is an inner node an array of its contained leafs (dataframe column
 * indices) is returned.
 *
 * @param {object} clstr - An instance of ml-hclust's Cluster class
 *
 * @return {array} Returns the indices of the contained dataframe columns.
 */
export function getChildren(clstr) {
  if (clstr.isLeaf) {
    return [clstr.index]
  } else {
    return clstr.children.reduce((a, c) => {
      return [...a, getChildren(c)];
    }, []);
  }
}
