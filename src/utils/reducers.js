import { isEmptyObject } from './validation';

/**
 * This recursive reducer builds a tree-like object from a two-dimensional array.
 * For this reducer to success, two conditions must be met:
 *
 * - Each child array is assumed to be a branch of the tree.
 * - Each node in the tree is an object that can have an arbitrary number of child nodes.
 * - The final layer of nodes in the tree will be an array.
 * - Uniqueness of the final layer is not ensured, up to the user to handle this case.
 *
 * @param {Object<string,any>} tree
 * @param {string[]} branch
 */
export function buildTreeBranches (tree, branch) {

  const node = branch.shift();

  /**
   * Tail: this is the last node in the branch, which is
   * always returned with an array value.
   */
  if (branch.length === 1) {
    if (isEmptyObject(tree) || !tree[node]) tree[node] = branch;
    else tree[node] = [ ...tree[node], ...branch ];
    return tree;
  }

  /**
   * Head: this is the first node of the recursively passed
   * tree, which is always an empty object, to be populated
   * recursively.
   */
  if (!tree[node]) tree[node] = {};

  /**
   * Finally build the current head with the subtree returned
   * from the recursive function.
   */
  tree[node] = buildTreeBranches(tree[node], branch);
  return tree;

}