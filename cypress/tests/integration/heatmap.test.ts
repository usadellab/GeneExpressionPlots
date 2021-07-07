import chaiExclude from 'chai-exclude';
chai.use(chaiExclude);

import {
  computeGeneXDistance,
  clusterGeneXMatrix,
  clusterToTree,
  getTreeLeaves,
  sortClusteredMatrix,
  matrixToBins,
} from '@/utils/plots/heatmap';

const table = {
  header: ['rep-A', 'rep-B', 'rep-C', 'rep-D'],
  rows: {
    'Gene-1': ['0.9995255', '1.092261', '1.995518', '2.020559'],
    'Gene-2': ['1.0097479', '1.107543', '2.009799', '2.022110'],
    'Gene-3': ['0.9954607', '1.111766', '2.006096', '2.025845'],
    'Gene-4': ['0.9943843', '1.106289', '1.990289', '2.018756'],
    'Gene-5': ['1.0064353', '1.081959', '2.017073', '2.015168'],
    'Gene-6': ['0.9960931', '1.102409', '2.004421', '2.005021'],
    'Gene-7': ['0.9843145', '1.102579', '1.999714', '2.022208'],
    'Gene-8': ['1.0137714', '1.092962', '2.011520', '2.009035'],
  },
};

const d = new Dataframe();
d.loadFromObject(table);

import { Dataframe } from '@/store/dataframe';
import { Cluster } from 'ml-hclust';

describe('Heatmap analysis', function () {
  it('Can compute euclidian distance Matrix with all replicates', () => {
    // Prepare the data from the store
    const replicateCounts: number[][] = d.toArrayOfColumns(d.colNames);

    // Compute the euclidean distance matrix between each gene
    const distanceMatrix = computeGeneXDistance(replicateCounts, 'euclidean');

    expect(distanceMatrix).to.deep.eq([
      [0, 0.28544330816740127, 2.8407684297980977, 2.877788271113938],
      [0.28544330816740127, 0, 2.5588835642158476, 2.5955348423432887],
      [2.8407684297980977, 2.5588835642158476, 0, 0.04995147423249907],
      [2.877788271113938, 2.5955348423432887, 0.04995147423249907, 0],
    ]);
  });

  it('Can compute euclidian distance Matrix with all replicates', () => {
    // Prepare the data from the store
    const replicateCounts: number[][] = d.toArrayOfColumns([
      'rep-A',
      'rep-B',
      'rep-C',
    ]);

    // Compute the euclidean distance matrix between each gene
    const distanceMatrix = computeGeneXDistance(replicateCounts, 'euclidean');

    expect(distanceMatrix).to.deep.eq([
      [0, 0.28544330816740127, 2.8407684297980977],
      [0.28544330816740127, 0, 2.5588835642158476],
      [2.8407684297980977, 2.5588835642158476, 0],
    ]);
  });

  it('Can cluster the distance matrix', () => {
    const cluster = clusterGeneXMatrix(
      [
        [0, 0.28544330816740127, 2.8407684297980977, 2.877788271113938],
        [0.28544330816740127, 0, 2.5588835642158476, 2.5955348423432887],
        [2.8407684297980977, 2.5588835642158476, 0, 0.04995147423249907],
        [2.877788271113938, 2.5955348423432887, 0.04995147423249907, 0],
      ],
      'ward'
    );

    expect(cluster).to.deep.eq({
      children: [
        {
          children: [
            {
              children: [],
              height: 0,
              size: 1,
              index: 3,
              isLeaf: true,
            },
            {
              children: [],
              height: 0,
              size: 1,
              index: 2,
              isLeaf: true,
            },
          ],
          height: 0.04995147423249907,
          size: 2,
          index: -1,
          isLeaf: false,
        },
        {
          children: [
            {
              children: [],
              height: 0,
              size: 1,
              index: 1,
              isLeaf: true,
            },
            {
              children: [],
              height: 0,
              size: 1,
              index: 0,
              isLeaf: true,
            },
          ],
          height: 0.28544330816740127,
          size: 2,
          index: -1,
          isLeaf: false,
        },
      ],
      height: 5.268790162535636,
      size: 4,
      index: -1,
      isLeaf: false,
    });
  });

  it('Can compute tree from cluster', () => {
    const cluster = {
      children: [
        {
          children: [
            {
              children: [],
              height: 0,
              size: 1,
              index: 3,
              isLeaf: true,
            },
            {
              children: [],
              height: 0,
              size: 1,
              index: 2,
              isLeaf: true,
            },
          ],
          height: 0.04995147423249907,
          size: 2,
          index: -1,
          isLeaf: false,
        },
        {
          children: [
            {
              children: [],
              height: 0,
              size: 1,
              index: 1,
              isLeaf: true,
            },
            {
              children: [],
              height: 0,
              size: 1,
              index: 0,
              isLeaf: true,
            },
          ],
          height: 0.28544330816740127,
          size: 2,
          index: -1,
          isLeaf: false,
        },
      ],
      height: 5.268790162535636,
      size: 4,
      index: -1,
      isLeaf: false,
    } as Cluster;

    const tree = clusterToTree(cluster, d.colNames);
    expect(tree)
      .excludingEvery('name')
      .to.deep.eq({
        name: 'T7Bb69A-0-zYkBAtAkyxz',
        children: [
          {
            name: 'wQpn3qseoDGUC0WVon_ff',
            children: [
              {
                name: 'rep-D',
              },
              {
                name: 'rep-C',
              },
            ],
          },
          {
            name: 'dCzkO1hpIyCqBq5P4vWlO',
            children: [
              {
                name: 'rep-B',
              },
              {
                name: 'rep-A',
              },
            ],
          },
        ],
      });
  });

  it('Can calculate bins sorted according to the clustering', () => {
    const cluster = {
      children: [
        {
          children: [
            {
              children: [],
              height: 0,
              size: 1,
              index: 3,
              isLeaf: true,
            },
            {
              children: [],
              height: 0,
              size: 1,
              index: 2,
              isLeaf: true,
            },
          ],
          height: 0.04995147423249907,
          size: 2,
          index: -1,
          isLeaf: false,
        },
        {
          children: [
            {
              children: [],
              height: 0,
              size: 1,
              index: 1,
              isLeaf: true,
            },
            {
              children: [],
              height: 0,
              size: 1,
              index: 0,
              isLeaf: true,
            },
          ],
          height: 0.28544330816740127,
          size: 2,
          index: -1,
          isLeaf: false,
        },
      ],
      height: 5.268790162535636,
      size: 4,
      index: -1,
      isLeaf: false,
    } as Cluster;

    const distanceMatrix = [
      [0, 0.28544330816740127, 2.8407684297980977, 2.877788271113938],
      [0.28544330816740127, 0, 2.5588835642158476, 2.5955348423432887],
      [2.8407684297980977, 2.5588835642158476, 0, 0.04995147423249907],
      [2.877788271113938, 2.5955348423432887, 0.04995147423249907, 0],
    ];

    // get sorted Tree leaves
    const sortedCols = getTreeLeaves(cluster, d.colNames);
    expect(sortedCols).to.deep.eq({
      'rep-D': 3,
      'rep-C': 2,
      'rep-B': 1,
      'rep-A': 0,
    });

    // Sort the matrix according to the sorted Tree leaves
    const sortedMatrix = sortClusteredMatrix(
      distanceMatrix,
      Object.values(sortedCols)
    );
    expect(sortedMatrix).to.deep.eq([
      [0, 0.04995147423249907, 2.5955348423432887, 2.877788271113938],
      [0.04995147423249907, 0, 2.5588835642158476, 2.8407684297980977],
      [2.5955348423432887, 2.5588835642158476, 0, 0.28544330816740127],
      [2.877788271113938, 2.8407684297980977, 0.28544330816740127, 0],
    ]);

    // Transform the matrix data to be consumed by @visx/heatmap
    const bins = sortedMatrix.map(matrixToBins(Object.keys(sortedCols)));
    expect(bins).to.deep.eq([
      {
        bin: 'rep-D',
        bins: [
          {
            bin: 'rep-D',
            count: 0,
          },
          {
            bin: 'rep-C',
            count: 0.04995147423249907,
          },
          {
            bin: 'rep-B',
            count: 2.5955348423432887,
          },
          {
            bin: 'rep-A',
            count: 2.877788271113938,
          },
        ],
      },
      {
        bin: 'rep-C',
        bins: [
          {
            bin: 'rep-D',
            count: 0.04995147423249907,
          },
          {
            bin: 'rep-C',
            count: 0,
          },
          {
            bin: 'rep-B',
            count: 2.5588835642158476,
          },
          {
            bin: 'rep-A',
            count: 2.8407684297980977,
          },
        ],
      },
      {
        bin: 'rep-B',
        bins: [
          {
            bin: 'rep-D',
            count: 2.5955348423432887,
          },
          {
            bin: 'rep-C',
            count: 2.5588835642158476,
          },
          {
            bin: 'rep-B',
            count: 0,
          },
          {
            bin: 'rep-A',
            count: 0.28544330816740127,
          },
        ],
      },
      {
        bin: 'rep-A',
        bins: [
          {
            bin: 'rep-D',
            count: 2.877788271113938,
          },
          {
            bin: 'rep-C',
            count: 2.8407684297980977,
          },
          {
            bin: 'rep-B',
            count: 0.28544330816740127,
          },
          {
            bin: 'rep-A',
            count: 0,
          },
        ],
      },
    ]);
  });
});
