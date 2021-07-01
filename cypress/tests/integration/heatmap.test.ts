import {
  clusterExpressionReplicates,
  getChildren,
  convertTreeForD3,
  convertForD3,
} from '@/utils/heatmap';
import { Dataframe } from '@/store/dataframe';

describe('Heatmap analysis', function () {
  it('Can cluster genes by their expression measurement', () => {
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

    const clustRes = clusterExpressionReplicates(d);

    const newickTree = getChildren(clustRes.tree);
    expect(newickTree).to.deep.equal([
      [[3], [2]],
      [[1], [0]],
    ]);

    const replicateNames = d.colNames;
    const plottableTree = convertTreeForD3(clustRes.tree, replicateNames);
    expect(plottableTree.children.length).to.equal(2);
    expect(plottableTree.children[0].children.length).to.equal(2);
    expect(plottableTree.children[1].children.length).to.equal(2);
    expect(plottableTree.children[0].children[0].name).to.deep.equal(['rep-D']);
    expect(plottableTree.children[0].children[1].name).to.deep.equal(['rep-C']);
    expect(plottableTree.children[1].children[0].name).to.deep.equal(['rep-B']);
    expect(plottableTree.children[1].children[1].name).to.deep.equal(['rep-A']);

    const plottableResult = convertForD3(clustRes, replicateNames);
    expect(plottableResult).to.have.property('matrix');
    expect(plottableResult).to.have.property('rowJSON');
    expect(plottableResult).to.have.property('colJSON');
  });
});
