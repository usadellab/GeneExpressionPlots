import { agnes } from 'ml-hclust';
import getDistanceMatrix from 'ml-distance-matrix';
import {
  euclidean
} from 'ml-distance-euclidean';
import { nanoid } from 'nanoid';

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
  const arrOfReplicates = dataframe.toTransposed2dArray();
  const distanceMatrix = getDistanceMatrix(arrOfReplicates, euclidean);
  const tree = agnes(distanceMatrix, {
    method: 'ward',
    isDistanceMatrix: true
  });
  return {
    distanceMatrix,
    tree
  };
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
 * @return {array} Returns the indices of the contained dataframe columns. The
 * array can be read as the Newick representation of the tree.
 */
export function getChildren(clstr) {
  if (clstr.isLeaf) {
    return [clstr.index];
  } else {
    return clstr.children.reduce((a, c) => {
      return [...a, getChildren(c)];
    }, []);
  }
}

/**
 * Traverses the argument tree in a recursive approach converting each node to
 * an object with at most two properties 'name' of type array and 'children'
 * also of type array.
 *
 * @param {object} clstr - An instance of ml-hclust's Cluster class
 * @param {array} leafNames - An array of names of the leaves, indexed as
 * indicated by ml-hclust's Cluster.
 *
 * @return {object} A tree converted into node with two properties 'name' and
 * 'children' converted from argument 'clstr'. Each node property is of type
 * array.
 */
export function convertTreeForD3(clstr, leafNames) {
  if (clstr.isLeaf) {
    return {
      name: [leafNames[clstr.index]]
    };
  } else {
    const name = [nanoid()];
    const children = clstr.children.map(c => convertTreeForD3(c, leafNames));
    return {
      name,
      children
    };
  }
}

export function convertForD3(clusterExpressionReplicatesResult, leafNames) {
  const convertedTree = convertTreeForD3(clusterExpressionReplicatesResult.tree, leafNames);
  return {
    matrix: clusterExpressionReplicatesResult.distanceMatrix,
    rowJSON: convertedTree,
    colJSON: convertedTree
  };
}
