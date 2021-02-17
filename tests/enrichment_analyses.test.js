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
})
