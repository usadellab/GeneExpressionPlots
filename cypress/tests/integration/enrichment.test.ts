import { Dataframe } from '@/store/dataframe';
import {
  intersect,
  construct_contingency_table,
  test_for_enrichment,
} from '@/utils/enrichment_analyses';

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

    const contigencyTable = construct_contingency_table(
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
      return construct_contingency_table(pos_a, neg_a, pos_b, neg_b, true);
    };

    expect(invoke_construct_contingency_table).to.throw(
      'Contingency table sums up to 5, but universe has (arguments union to a set of) 6 elements. This number must be identical.' +
        " 5 elements have trait 'A', but contingency table's first column sums to 4. Numbers must be equal." +
        " 5 elements have trait 'B', but contingency table's first row sums to 3. Numbers must be equal." +
        " 1 elements have trait 'B', but contingency table's second row sums to 2. Numbers must be equal."
    );
  });

  it('enrichment is found in test data', () => {
    const mockTable = {
      header: ['Gene-ID', 'trait-A', 'trait-B'],
      rows: [
        ['Gene-1', 'a-neg', 'b-neg'],
        ['Gene-2', 'a-neg', 'b-pos'],
        ['Gene-3', 'a-pos', 'b-neg'],
        ['Gene-4', 'a-pos', 'b-neg'],
        ['Gene-5', 'a-neg', 'b-pos'],
        ['Gene-6', 'NA', 'NA'],
        ['Gene-7', 'NA', 'b-pos'],
        ['Gene-8', 'a-neg', 'NA'],
      ],
    };

    const d = new Dataframe();
    d.loadFromObject(mockTable);

    const filter_funk = (rows: string[]): string[] | undefined =>
      rows.filter((r) => !r.includes('NA'));

    const trait_A_selector = (rows: string[]): string[] | undefined =>
      rows.filter((r) => r[1] === 'a-pos');

    const trait_B_selector = (rows: string[]): string[] | undefined =>
      rows.filter((r) => r[2] === 'b-pos');

    const fish_exact_test_rslt = test_for_enrichment({
      dataframe: d,
      filter_funk,
      trait_A_selector,
      trait_B_selector,
      element_col: 0,
    });

    expect(fish_exact_test_rslt.contingency_table).to.deep.equal([0, 2, 2, 1]);
    expect(fish_exact_test_rslt.fishers_exact_test_result.rightPValue).to.equal(
      0.9999999999999999
    );
  });
});
