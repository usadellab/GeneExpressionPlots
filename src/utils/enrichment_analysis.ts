import { DataRow } from '@/store/dataframe';
import {
  EnrichmentAnalysisOptions,
  SelectorFunction,
  TEFSelectorOption,
  TEISelectorOption,
  TEISelectorType,
} from '@/types/enrichment';
import fishersExactTest from '@/utils/fishers-exact-test';
import { toArrayOfRows } from './store';

/**
 * Intersects the two argument Sets `a` and `b`.
 *
 * @param {Set} a
 * @param {Set} b
 *
 * @return {Set} The intersection of argument Sets a and b
 */
export function intersect(a: Set<string>, b: Set<string>): Set<string> {
  if (a.constructor.name !== 'Set' || b.constructor.name !== 'Set')
    throw Error(
      `Arguments must be of class 'Set', but a is an ${a.constructor.name} and b is an ${b.constructor.name}`
    );
  const a_arr = [...a];
  return new Set(a_arr.filter((x) => b.has(x)));
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
  trait_A_pos_elems: Set<string>,
  trait_A_neg_elems: Set<string>,
  trait_B_pos_elems: Set<string>,
  trait_B_neg_elems: Set<string>,
  validate?: boolean
): number[] {
  const cont_table = [
    intersect(trait_A_pos_elems, trait_B_pos_elems).size,
    intersect(trait_A_neg_elems, trait_B_pos_elems).size,
    intersect(trait_B_neg_elems, trait_A_pos_elems).size,
    intersect(trait_B_neg_elems, trait_A_neg_elems).size,
  ];
  // Validate the contingency table - experience shows, this makes a _lot_ of
  // sense:
  if (validate) {
    // Collect validation errors:
    const errs = [];
    // Number of elements in universe must be equal to total sum in cont_table:
    const total_sum = cont_table.reduce((acc, curr) => acc + curr);
    const n_elemns = new Set([
      ...trait_A_pos_elems,
      ...trait_A_neg_elems,
      ...trait_B_pos_elems,
      ...trait_B_neg_elems,
    ]).size;
    if (total_sum !== n_elemns) {
      errs.push(
        `Contingency table sums up to ${total_sum}, but universe has (arguments union to a set of) ${n_elemns} elements. This number must be identical.`
      );
    }
    // Number of positive A elements must equal sum of first column of
    // cont_table:
    const first_col_sum = cont_table[0] + cont_table[2];
    if (first_col_sum !== trait_A_pos_elems.size) {
      errs.push(
        `${trait_A_pos_elems.size} elements have trait 'A', but contingency table's first column sums to ${first_col_sum}. Numbers must be equal.`
      );
    }
    // Number of positive B elements must equal sum of first row of
    // cont_table:
    const first_row_sum = cont_table[0] + cont_table[1];
    if (first_row_sum !== trait_A_pos_elems.size) {
      errs.push(
        `${trait_A_pos_elems.size} elements have trait 'B', but contingency table's first row sums to ${first_row_sum}. Numbers must be equal.`
      );
    }
    // Number of negative A elements must equal sum of second column of
    // cont_table:
    const second_col_sum = cont_table[1] + cont_table[3];
    if (second_col_sum !== trait_A_neg_elems.size) {
      errs.push(
        `${trait_A_neg_elems.size} elements have trait 'A', but contingency table's second column sums to ${second_col_sum}. Numbers must be equal.`
      );
    }
    // Number of negative B elements must equal sum of second row of
    // cont_table:
    const second_row_sum = cont_table[2] + cont_table[3];
    if (second_row_sum !== trait_A_neg_elems.size) {
      errs.push(
        `${trait_A_neg_elems.size} elements have trait 'B', but contingency table's second row sums to ${second_row_sum}. Numbers must be equal.`
      );
    }
    // Any validation errors?
    if (errs.length > 0) {
      throw Error(errs.join(' '));
    }
  }
  return cont_table;
}

/**
 * Extracts a column by its index from a two dimensional matrix, the
 * argument `rows`.
 *
 * @param {array} rows - A two dimensional matrix as an array of rows,
 *                       where each row is an array of equal size.
 * @param {number} col_index - The index of the column to extract,
 *                             starting with zero for the first column.
 *
 * @return {array} The extracted column
 */
export function getAccessions(rows: (string | number)[][]): string[] {
  return rows.map((r) => r[0] as string);
}

/**
 * Uses Fisher's exact test to assess the alternative hypotheses of over- or
 * underrepresentation of a trait A positive elements among trait B positive
 * elements.
 *
 * @param {object} {
 *   dataframe - an instance of class Dataframe
 *   filter_funk - a function accepting a single argument (rows) from the
 *                 dataframe and filters those out to be used in the test
 *   element_col - the index of the column of dataframe.rows in which to find
 *                 the element identifiers
 *   trait_A_selector - a function accepting a single argument (rows) from the
 *                      dataframe that retains those rows that are considered
 *                      trait A positive
 *   trait_B_selector - a function accepting a single argument (rows) from the
 *                      dataframe that retains those rows that are considered
 *                      trait B positive
 * }
 *
 * @return {object} An object with two fields; see the following example:
 *  {
 *    contingency_table: [
 *      #(pos-A&pos-B), #(neg-A&pos-B),
 *      #(pos-A&neg-B), #(neg-A&neg-B)
 *    ],
 *    fishers_exact_test_result: {
 *      leftPValue:      0.0013797280926100416,
 *      rightPValue:     0.9999663480953023,
 *      oneTailedPValue: 0.0013797280926100416,
 *      twoTailedPValue: 0.002759456185220083
 *    }
 *  }
 *  _Note_, that the `rightPValue` indicates the likelihood that the observed
 *  values are underrepresented, i.e. in R that would be
 *  `fish.test(contingency_table, alternative='greater')$p.value`. In other
 *  words, a `rightPValue` _below_ your significance cutoff indicates
 *  enrichment of trait A positive elements among trait B positives.
 */
export function getSelectorFunction(
  selector: TEFSelectorOption,
  selectorValue: string,
  selectorIndex: number
): SelectorFunction {
  switch (selector) {
    case '<': {
      const parsedValue = parseFloat(selectorValue);
      const selectorFunction: SelectorFunction = (rows) =>
        rows.filter((r) => r[selectorIndex] < parsedValue);
      return selectorFunction;
    }
    case '>': {
      const parsedValue = parseFloat(selectorValue);
      const selectorFunction: SelectorFunction = (rows) =>
        rows.filter((r) => r[selectorIndex] > parsedValue);
      return selectorFunction;
    }
    case '<=': {
      const parsedValue = parseFloat(selectorValue);
      const selectorFunction: SelectorFunction = (rows) =>
        rows.filter((r) => r[selectorIndex] <= parsedValue);
      return selectorFunction;
    }
    case '>=': {
      const parsedValue = parseFloat(selectorValue);
      const selectorFunction: SelectorFunction = (rows) =>
        rows.filter((r) => r[selectorIndex] >= parsedValue);
      return selectorFunction;
    }
    case '==': {
      const selectorFunction: SelectorFunction = (rows) => {
        return rows.filter((r) => r[selectorIndex] == selectorValue);
      };
      return selectorFunction;
    }
    case 'regexp': {
      const selectorFunction: SelectorFunction = (rows) =>
        rows.filter((r) => {
          const regexp = new RegExp(selectorValue);
          const rowAsString = r[selectorIndex] as string;
          return rowAsString.match(regexp) ? true : false;
        });
      return selectorFunction;
    }

    default:
      throw new Error(`unsupported selector ${selector}`);
  }
}

interface test_for_enrichment_args {
  rows: DataRow;
  trait_A_selector: (matrix: (string | number)[][]) => (string | number)[][];
  trait_B_selector: (matrix: (string | number)[][]) => (string | number)[][];
}

export function test_for_enrichment({
  rows,
  trait_A_selector,
  trait_B_selector,
}: test_for_enrichment_args): number {
  // console.log({ dataframe });
  const rowsAsMatrix = Object.entries(rows).map((r) => r.flat());
  // let rows = filter_funk ? filter_funk(rowsAsMatrix) : rowsAsMatrix;
  // console.log({ rowsAsMatrix });
  const universe = Object.keys(rows);
  // console.log({ universe });
  const trait_A_pos = new Set(getAccessions(trait_A_selector(rowsAsMatrix)));
  // console.log({ trait_A_pos });
  const trait_A_neg = new Set(universe.filter((x) => !trait_A_pos.has(x)));
  // console.log({ trait_A_neg });
  const trait_B_pos = new Set(getAccessions(trait_B_selector(rowsAsMatrix)));
  // console.log({ trait_B_pos });
  const trait_B_neg = new Set(universe.filter((x) => !trait_B_pos.has(x)));
  // console.log({ trait_B_neg });
  const cont_table = construct_contingency_table(
    trait_A_pos,
    trait_A_neg,
    trait_B_pos,
    trait_B_neg
  );
  console.log({ cont_table });
  const fishers_exact_test_result = fishersExactTest(...cont_table);
  // console.log({ fishers_exact_test_result });
  // return {
  //   contingency_table: cont_table,
  //   fishers_exact_test_result: fishersExactTest(...cont_table),
  // };
  return fishers_exact_test_result.rightPValue;
}

export function runEnrichmentAnalysis(
  rows: DataRow,
  options: EnrichmentAnalysisOptions,
  TEFcolIndex: number,
  TEIcolIndex: number
): (string | number)[][] {
  const data: (string | number)[][] = [];

  const TEFselectorFunction = getSelectorFunction(
    options.TEFselector,
    options.TEFselectorValue,
    TEFcolIndex
  );

  switch (options.TEIselectorType) {
    case 'binary': {
      const TEIselectorFunction = getSelectorFunction(
        options.TEIselector as TEFSelectorOption,
        options.TEIselectorValue,
        TEIcolIndex
      );
      const pValue = test_for_enrichment({
        rows,
        trait_A_selector: TEFselectorFunction,
        trait_B_selector: TEIselectorFunction,
      });
      data.push([options.TEIselectorValue, pValue]);
      break;
    }
    case 'multinomial': {
      const TEIvalues: string[] = [];
      if (options.TEIselector === 'delimiter') {
        Object.values(rows).forEach((row) => {
          const TEIcolumnValues = row[TEIcolIndex - 1].split(
            options.TEIselectorValue
          );
          // console.log(row[TEIcolIndex - 1]);
          // console.log(options.TEIselectorValue);
          // console.log({ TEIcolumnValues });
          TEIvalues.push(...TEIcolumnValues);
        });
      } else if (options.TEIselector === 'regexp') {
        const regexp = new RegExp(options.TEIselectorValue, 'g');
        // console.log({ regexp, val: options.TEIselectorValue });
        Object.values(rows).forEach((row) => {
          const TEIcolumnValues = row[TEIcolIndex - 1].match(regexp);
          // console.log({ TEIcolumnValues });
          TEIcolumnValues &&
            TEIcolumnValues.length > 1 &&
            TEIvalues.push(...TEIcolumnValues);
        });
      }
      // console.log({ TEIvalues });
      const uniqueTEIvalues = [...new Set(TEIvalues)];
      // console.log({ uniqueTEIvalues });
      uniqueTEIvalues.forEach((value) => {
        const TEIselectorFunction = getSelectorFunction(
          'regexp',
          value,
          TEIcolIndex
        );
        const pValue = test_for_enrichment({
          rows,
          trait_A_selector: TEFselectorFunction,
          trait_B_selector: TEIselectorFunction,
        });
        // console.log({ pValue });
        data.push([value, pValue]);
      });
      break;
    }
    default:
      throw new Error(`unsupported selector type ${options.TEIselectorType}`);
  }
  return data;
}
