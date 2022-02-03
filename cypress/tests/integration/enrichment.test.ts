import { Dataframe } from '@/store/dataframe';
import {
  intersect,
  constructContingencyTable,
  getSelectorFunction,
} from '@/utils/enrichment_analysis';

describe('Enrichment analysis', function () {
  it('intersect generates the set-intersection of two arrays', () => {
    const setA = new Set([1, 2, 3]);
    const setB = new Set([2, 3, 4]);
    const setC = new Set([2, 3]);
    expect(intersect(setA, setB)).to.deep.equal(setC);
  });

  it('construct_contingency_table does correct intersections', () => {
    const pos_a = new Set([1, 2, 3, 4]);
    const neg_a = new Set([5]);
    const pos_b = new Set([2, 3, 4]);
    const neg_b = new Set([1, 5]);

    const contigencyTable = constructContingencyTable(
      pos_a,
      neg_a,
      pos_b,
      neg_b
    );

    expect(contigencyTable).to.deep.equal([3, 0, 1, 1]);
  });

  it('construct_contingency_table validates elements', () => {
    const invoke_construct_contingency_table = (): any => {
      const pos_a = new Set([1, 2, 3, 4, 7]);
      const neg_a = new Set([5]);
      const pos_b = new Set([2, 3, 4]);
      const neg_b = new Set([1, 5]);
      return constructContingencyTable(pos_a, neg_a, pos_b, neg_b, true);
    };

    expect(invoke_construct_contingency_table).to.throw(
      'Contingency table sums up to 5, but universe has (arguments union to a set of) 6 elements. This number must be identical.' +
        " 5 elements have trait 'A', but contingency table's first column sums to 4. Numbers must be equal." +
        " 5 elements have trait 'B', but contingency table's first row sums to 3. Numbers must be equal." +
        " 1 elements have trait 'B', but contingency table's second row sums to 2. Numbers must be equal."
    );
  });

  it('enrichment is found in test data', async () => {
    const mockTable = {
      header: ['trait-A', 'trait-B'],
      rows: {
        'Gene-1': ['a-neg', 'b-neg'],
        'Gene-2': ['a-neg', 'b-pos'],
        'Gene-3': ['a-pos', 'b-neg'],
        'Gene-4': ['a-pos', 'b-neg'],
        'Gene-5': ['a-neg', 'b-pos'],
        'Gene-6': ['NA', 'NA'],
        'Gene-7': ['NA', 'b-pos'],
        'Gene-8': ['a-neg', 'NA'],
      },
    };

    const d = new Dataframe();
    d.loadFromObject(mockTable);

    const TEFselectorFunction = getSelectorFunction('==', 'a-pos');
    const TEFcol = d.getColumn('trait-A');

    const geneIdsTEFpos = new Set(TEFselectorFunction(TEFcol));
    expect(geneIdsTEFpos).to.deep.equal(new Set(['Gene-3', 'Gene-4']));

    const geneIdsTEFneg = new Set(
      Object.keys(d.rows).filter((id) => !geneIdsTEFpos.has(id))
    );

    expect(geneIdsTEFneg).to.deep.equal(
      new Set(['Gene-1', 'Gene-2', 'Gene-5', 'Gene-6', 'Gene-7', 'Gene-8'])
    );

    const universe = Object.keys(d.rows);

    const TEIcol = d.getColumn('trait-B');
    const TEIselectorFunction = getSelectorFunction('==', 'b-pos');

    const geneIdsTEIpos = new Set(TEIselectorFunction(TEIcol));
    expect(geneIdsTEIpos).to.deep.equal(
      new Set(['Gene-2', 'Gene-5', 'Gene-7'])
    );

    const geneIdsTEIneg = new Set(
      universe.filter((id) => !geneIdsTEIpos.has(id))
    );
    expect(geneIdsTEIneg).to.deep.equal(
      new Set(['Gene-1', 'Gene-3', 'Gene-4', 'Gene-6', 'Gene-8'])
    );

    const contingencyTable = constructContingencyTable(
      geneIdsTEFpos,
      geneIdsTEFneg,
      geneIdsTEIpos,
      geneIdsTEIneg
    );

    expect(contingencyTable).to.deep.equal([0, 3, 2, 3]);
  });
});
