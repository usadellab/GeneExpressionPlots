import {
  intersect,
  construct_contingency_table,
  test_for_enrichment
} from '../src/utils/enrichment_analyses'
import {
  Dataframe
} from '../src/store/dataframe'

test('intersect generates the set-intersection of two arrays', () => {
  expect(intersect(
    new Set([1, 2, 3]), new Set([2, 3, 4]))).toStrictEqual(
    new Set([2, 3])
  )
})

test('construct_contingency_table does correct intersections', () => {
  let pos_a = new Set([1, 2, 3, 4])
  let neg_a = new Set([5])
  let pos_b = new Set([2, 3, 4])
  let neg_b = new Set([1, 5])
  expect(construct_contingency_table(
    pos_a, neg_a,
    pos_b, neg_b
  )).toStrictEqual([3, 0, 1, 1])
})

test('construct_contingency_table validates elements', () => {
  let invoke_construct_contingency_table = () => {
    let pos_a = new Set([1, 2, 3, 4, 7])
    let neg_a = new Set([5])
    let pos_b = new Set([2, 3, 4])
    let neg_b = new Set([1, 5])
    return construct_contingency_table(
      pos_a, neg_a,
      pos_b, neg_b,
      true
    )
  }
  expect(invoke_construct_contingency_table).toThrowError(
    /Contingency table sums up to [0-9]+, but universe has \(arguments union to a set of\) [0-9]+ elements. This number must be identical./
  )
})

test('enrichment is found in test data', () => {
  let d = new Dataframe()
  let table = {
    header: ["Gene-ID", "trait-A", "trait-B"],
    rows: [
      ['Gene-1', 'a-neg', 'b-neg'],
      ['Gene-2', 'a-neg', 'b-pos'],
      ['Gene-3', 'a-pos', 'b-neg'],
      ['Gene-4', 'a-pos', 'b-neg'],
      ['Gene-5', 'a-neg', 'b-pos'],
      ['Gene-6', 'NA', 'NA'],
      ['Gene-7', 'NA', 'b-pos'],
      ['Gene-8', 'a-neg', 'NA'],
    ]
  }
  d.loadFromObject(table)
  console.log(JSON.stringify(d))
  let filter_funk = (rows) => rows.filter(r => !r.includes('NA'))
  let trait_A_selector = (rows) => rows.filter(r => r[1] === 'a-pos')
  let trait_B_selector = (rows) => rows.filter(r => r[2] === 'b-pos')
  let fish_exact_test_rslt = test_for_enrichment({
    dataframe: d,
    filter_funk,
    trait_A_selector,
    trait_B_selector,
    element_col: 0
  })
  console.log(JSON.stringify(fish_exact_test_rslt))
})
