import fishersExactTest from 'fishers-exact-test';

/**
 * Intersects the two argument Sets `a` and `b`.
 *
 * @param {Set} a
 * @param {Set} b
 *
 * @return {Set} The intersection of argument Sets a and b
 */
export function intersect(a, b) {
  let a_arr = [...a]
  return new Set(a_arr.filter(x => b.has(x)))
}

/**
 * Constructs a two by two contingency table to be used in statistical
 * hypotheses testing, e.g. with Fisher's exact test or with the Chi-Square
 * distribution. A contingency table lists the number of elements that fulfill
 * the logical conditions of both their respective row and column (see return
 * section for more details).
 *
 * @param {Set} trait_A_pos_elems - A Set of elements that HAVE the trait "A"
 * @param {Set} trait_A_neg_elems - A Set of elements that DON't have the trait "A"
 * @param {Set} trait_B_pos_elems - A Set of elements that HAVE the trait "B"
 * @param {Set} trait_B_neg_elems - A Set of elements that DON't have the trait "B"
 * @param {boolean} validate - Flag to indicate whether the arguments should be
 * validated. In this the function checks wether the respective argument sets
 * truly form a complete observation.
 *
 * @return {array} An array representing the two by two contingency table,
 * elements are listed row by row. Indices in the array correspond to the
 * following layout of the contingency table:
 *        pos A | neg A
 *       +------+------
 * pos B |   0  |   1
 * neg B |   2  |   3
 */
export function construct_contingency_table(
  trait_A_pos_elems, trait_A_neg_elems,
  trait_B_pos_elems, trait_B_neg_elems,
  validate
) {
  let cont_table = [
    intersect(trait_A_pos_elems, trait_B_pos_elems).size,
    intersect(trait_A_neg_elems, trait_B_pos_elems).size,
    intersect(trait_B_neg_elems, trait_A_pos_elems).size,
    intersect(trait_B_neg_elems, trait_A_neg_elems).size
  ]
  // Validate the contingency table - experience shows, this makes a _lot_ of
  // sense:
  if (validate) {
    // Collect validation errors:
    let errs = []
    // Number of elements in universe must be equal to total sum in cont_table:
    let total_sum = cont_table.reduce((acc, curr) => acc + curr)
    let n_elemns = new Set([
      ...trait_A_pos_elems, ...trait_A_neg_elems,
      ...trait_B_pos_elems, ...trait_B_neg_elems
    ]).size
    if (total_sum !== n_elemns) {
      errs.push(
        `Contingency table sums up to ${total_sum}, but universe has (arguments union to a set of) ${n_elemns} elements. This number must be identical.`
      )
    }
    // Number of positive A elements must equal sum of first column of
    // cont_table:
    let first_col_sum = cont_table[0] + cont_table[2]
    if (first_col_sum !== trait_A_pos_elems.size) {
      errs.push(
        `${trait_A_pos_elems.size} elements have trait 'A', but contingency table's first column sums to ${first_col_sum}. Numbers must be equal.`
      )
    }
    // Number of positive B elements must equal sum of first row of
    // cont_table:
    let first_row_sum = cont_table[0] + cont_table[1]
    if (first_row_sum !== trait_A_pos_elems.size) {
      errs.push(
        `${trait_A_pos_elems.size} elements have trait 'B', but contingency table's first row sums to ${first_row_sum}. Numbers must be equal.`
      )
    }
    // Number of negative A elements must equal sum of second column of
    // cont_table:
    let second_col_sum = cont_table[1] + cont_table[3]
    if (second_col_sum !== trait_A_neg_elems.size) {
      errs.push(
        `${trait_A_neg_elems.size} elements have trait 'A', but contingency table's second column sums to ${second_col_sum}. Numbers must be equal.`
      )
    }
    // Number of negative B elements must equal sum of second row of
    // cont_table:
    let second_row_sum = cont_table[2] + cont_table[3]
    if (second_row_sum !== trait_A_neg_elems.size) {
      errs.push(
        `${trait_A_neg_elems.size} elements have trait 'B', but contingency table's second row sums to ${second_row_sum}. Numbers must be equal.`
      )
    }
    // Any validation errors?
    if (errs.length > 0) {
      throw Error(errs.join(" "))
    }
  }
  return cont_table
}

/**
 * Uses Fisher's exact test to assess the alternative hypotheses of over- or
 * underrepresentation of a trait A positive elements among trait B positive
 * elements.
 *
 * @return {object} An object with four keys:
 *  { leftPValue:      0.0013797280926100416,
 *    rightPValue:     0.9999663480953023,
 *    oneTailedPValue: 0.0013797280926100416,
 *    twoTailedPValue: 0.002759456185220083 }
 */
export function test_for_enrichment(dataframe,
  trait_A_col, trait_A_filter, trait_A_selector,
  trait_B_col, trait_B_filter, trait_B_selector) {
  let trait_A_elemns = trait_A_filter(dataframe.getColumnByIndex(trait_A_col))
  let trait_B_elemns = trait_B_filter(dataframe.getColumnByIndex(trait_B_col))
  let trait_A_pos = trait_A_selector(trait_A_elemns)
  let trait_A_neg = trait_A_elemns.filter(x => !trait_A_pos.contains(x))
  let trait_B_pos = trait_B_selector(trait_B_elemns)
  let trait_B_neg = trait_B_elemns.filter(x => !trait_B_pos.contains(x))
  return fishersExactTest(
    ...construct_contingency_table(
      trait_A_pos, trait_A_neg,
      trait_B_pos, trait_B_neg)
  )
}
