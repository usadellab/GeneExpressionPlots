import { isEmpty } from '@/utils/validation';

export interface ArrayTree {
  [key: string]: string[] | ArrayTree;
}

/**
 * Recursive reducer that builds a tree-like object from a two-dimensional array.
 *
 * - Each child array is assumed to be a branch of the tree.
 * - Overlapping branches are supported.
 * - Each node in the tree is an object with an arbitrary number of child nodes.
 * - The final layer of nodes in the tree will be an array.
 * - Uniqueness of the nodes in the final layer is not enforced.
 *
 * @param {Object<string,any>} tree
 * @param {string[]} branch
 */
export function buildTreeBranches(
  tree: ArrayTree,
  branch: string[]
): ArrayTree {
  const node = branch.shift() as string;

  /**
   * (Tail) The last node in the branch. It is
   * always returned with an array value.
   */
  if (branch.length === 1) {
    if (isEmpty(tree) || !tree[node]) tree[node] = branch;
    else tree[node] = [...(tree[node] as string[]), ...branch];
    return tree;
  }

  /**
   * (Head) The first node of the recursively passed
   * tree. It is always an empty object, to be populated
   * recursively.
   */
  if (!tree[node]) tree[node] = {};

  /**
   * Build the current head with the subtree returned
   * from the recursive function.
   */
  tree[node] = buildTreeBranches(tree[node] as ArrayTree, branch);
  return tree;
}
