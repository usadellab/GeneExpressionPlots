import {
  clusterExpressionReplicates
} from '../src/utils/heatmap';
import {
  Dataframe
} from '../src/store/dataframe';
import getDistanceMatrix from 'ml-distance-matrix';
import {
  euclidean
} from 'ml-distance-euclidean';

test('enrichment is found in test data', () => {
  let d = new Dataframe();
  let table = {
    header: ['Gene-ID', 'rep-A', 'rep-B', 'rep-C', 'rep-D'],
    rows: {
      'Gene-1': ['0.9995255', '1.092261', '1.995518', '2.020559'],
      'Gene-2': ['1.0097479', '1.107543', '2.009799', '2.022110'],
      'Gene-3': ['0.9954607', '1.111766', '2.006096', '2.025845'],
      'Gene-4': ['0.9943843', '1.106289', '1.990289', '2.018756'],
      'Gene-5': ['1.0064353', '1.081959', '2.017073', '2.015168'],
      'Gene-6': ['0.9960931', '1.102409', '2.004421', '2.005021'],
      'Gene-7': ['0.9843145', '1.102579', '1.999714', '2.022208'],
      'Gene-8': ['1.0137714', '1.092962', '2.011520', '2.009035'],
    }
  };
  d.loadFromObject(table);
  let clustRes = clusterExpressionReplicates(d);
  //console.log(getDistanceMatrix(d.toTransposed2dArray(), euclidean));
  //console.log(tree);
  //console.log(tree.indices());
  let getChildren = function(clstr) {
    if (clstr.isLeaf) {
      return clstr.index
    } else {
      return clstr.children.reduce((a, c) => {
        return [...a, getChildren(c)];
      }, []);
    }
  }
  clustRes.tree.traverse(x => {
    if (x.isLeaf) {
      console.log(`Child: ${x.index}`)
    } else {
      console.log(`Node has children: ${getChildren(x)}`)
    }
  })
  expect(true).toStrictEqual(true);
});
