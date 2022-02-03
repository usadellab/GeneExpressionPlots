import {
  EnrichmentAnalysisOptions,
  SelectorFunction,
  TEFSelectorOption,
} from '@/types/enrichment';
import fishersExactTest from '@/utils/fishers-exact-test';

/**
 * calculates Benjamini-Hochberg adjusted pValues
 * @param pValues
 * @returns Benjamini-Hochber adjusted pValues
 */
function pAdjustBH(pValues: number[]): number[] {
  const pValueCount = pValues.length;
  // sort and map pValues to their rank
  const sortedPValues: [number, number][] = pValues.map((val, i) => [val, i]);
  sortedPValues.sort((a, b) => a[0] - b[0]);
  // create array for adjusted pvalues
  const adjustedPValues = pValues.slice();
  for (let i = pValueCount - 1; i >= 0; i--) {
    const [value, rank] = sortedPValues[i];
    const prevRank = i < pValueCount - 1 ? sortedPValues[i + 1][1] : 0;
    const bhValue = Math.min((value * pValueCount) / (i + 1), 1);
    adjustedPValues[rank] = bhValue;
    if (
      i < pValueCount - 1 &&
      adjustedPValues[rank] > adjustedPValues[prevRank]
    ) {
      adjustedPValues[rank] = adjustedPValues[prevRank];
    }
  }
  return adjustedPValues;
}

/**
 * Intersects the two argument Sets `a` and `b`.
 *
 * @param {Set} a
 * @param {Set} b
 *
 * @return {Set} The intersection of argument Sets a and b
 */
export function intersect(
  a: Set<string | number>,
  b: Set<string | number>
): Set<string | number> {
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
export function constructContingencyTable(
  trait_A_pos_elems: Set<string | number>,
  trait_A_neg_elems: Set<string | number>,
  trait_B_pos_elems: Set<string | number>,
  trait_B_neg_elems: Set<string | number>,
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
 *
 * @param selector Selector filter criterium.
 * @param selectorValue Selector filter value.
 * @returns A function that filters a dataframe column for a given selector and selector value
 */
export function getSelectorFunction(
  selector: TEFSelectorOption,
  value: string
): SelectorFunction {
  switch (selector) {
    case '<':
      return (rows: { [key: string]: string }) =>
        Object.entries(rows)
          .filter((row) => parseFloat(row[1]) < parseFloat(value))
          .map((row) => row[0]);
    case '>': {
      return (rows: { [key: string]: string }) =>
        Object.entries(rows)
          .filter((row) => parseFloat(row[1]) > parseFloat(value))
          .map((row) => row[0]);
    }
    case '<=': {
      return (rows: { [key: string]: string }) =>
        Object.entries(rows)
          .filter((row) => parseFloat(row[1]) <= parseFloat(value))
          .map((row) => row[0]);
    }
    case '>=': {
      return (rows: { [key: string]: string }) =>
        Object.entries(rows)
          .filter((row) => parseFloat(row[1]) >= parseFloat(value))
          .map((row) => row[0]);
    }
    case '==': {
      return (rows: { [key: string]: string }) =>
        Object.entries(rows)
          .filter((row) => row[1] == value)
          .map((row) => row[0]);
    }
    case 'regexp':
      return (rows: { [key: string]: string }) =>
        Object.entries(rows)
          .filter((row) => {
            const regexp = new RegExp(value);
            return row[1].match(regexp) ? true : false;
          })
          .map((row) => row[0]);
    default:
      throw new Error(`unsupported selector ${selector}`);
  }
}

/**
 * @param contingencyTable contingency table
 * @returns An object containing the p_values, for example:
 *  {
 *    leftPValue:      0.0013797280926100416,
 *    rightPValue:     0.9999663480953023,
 *    oneTailedPValue: 0.0013797280926100416,
 *    twoTailedPValue: 0.002759456185220083
 *  }
 * _Note_, that the `rightPValue` indicates the likelihood that the observed
 *  values are underrepresented, i.e. in R that would be
 *  `fish.test(contingency_table, alternative='greater')$p.value`. In other
 *  words, a `rightPValue` _below_ your significance cutoff indicates
 *  enrichment of trait A positive elements among trait B positives.
 */
export async function testForEnrichment(contingencyTable: number[]): Promise<{
  leftPValue: number;
  rightPValue: number;
  oneTailedPValue: number;
  twoTailedPValue: number;
}> {
  const fishersExactTestResult = await fishersExactTest(
    contingencyTable[0],
    contingencyTable[1],
    contingencyTable[2],
    contingencyTable[3]
  );
  return fishersExactTestResult;
}

/**
 * Uses Fisher's exact test to assess the alternative hypotheses of over- or
 * underrepresentation of a trait A positive elements among trait B positive
 * elements.
 * @param contingencyTables An object containing the payload to be analyzed for each TEI (Test enrichment in)
 * positive column (trait B pos). For each of those a contingency table represents the value
 * @returns the output table to be rendered.
 */
export async function runEnrichment(contingencyTables: {
  [key: string]: number[];
}): Promise<(string | number)[][]> {
  const data: (string | number)[][] = [];
  const pValues: number[] = [];
  await Promise.all(
    Object.entries(contingencyTables).map(async ([key, cT]) => {
      const testResult = await testForEnrichment(cT);
      const pValue = testResult.rightPValue;
      pValues.push(pValue);
      data.push([key, pValue]);
    })
  );
  const bhAdjustPvalues = pAdjustBH(pValues);
  bhAdjustPvalues.forEach((val, i) => {
    data[i].push(val);
  });
  return data;
}

/**
 *
 * @param universe All transcript ids
 * @param geneIdsTEFpos trait A pos transcript ids
 * @param geneIdsTEFneg trait A neg transcript ids
 * @param TEIpayload trait B paylods. The dataframe column to be analyzed
 * @param options The enrichment analyses options
 * @returns For each trait B pos element, the corresponding contingency table
 */
export function getContingencyTables(
  universe: string[],
  geneIdsTEFpos: Set<string>,
  geneIdsTEFneg: Set<string>,
  TEIpayload: { [key: string]: string },
  options: EnrichmentAnalysisOptions
): { [key: string]: number[] } {
  switch (options.TEIselectorType) {
    case 'binary': {
      const TEIselectorFunction = getSelectorFunction(
        options.TEIselector as TEFSelectorOption,
        options.TEIselectorValue
      );
      const geneIdsTEIpos = new Set(TEIselectorFunction(TEIpayload));
      const geneIdsTEIneg = new Set(
        universe.filter((id) => !geneIdsTEIpos.has(id))
      );

      const key = `${options.TEIcolumn} ${options.TEIselector} ${options.TEIselectorValue}`;

      const contingencyTable = constructContingencyTable(
        geneIdsTEFpos,
        geneIdsTEFneg,
        geneIdsTEIpos,
        geneIdsTEIneg
      );
      return { [key]: contingencyTable };
    }
    case 'multinomial': {
      const uniqueTEIvalues2GeneIds: { [key: string]: string[] } = {};
      let TEIcolumnValues: string[] = [];

      Object.entries(TEIpayload).forEach(([id, col]) => {
        if (options.TEIselector === 'delimiter')
          TEIcolumnValues = col.split(options.TEIselectorValue);
        else if (options.TEFselector === 'regexp') {
          const regexp = new RegExp(options.TEIselectorValue, 'g');
          TEIcolumnValues = col.match(regexp) ?? [];
        }
        if (TEIcolumnValues) {
          TEIcolumnValues.forEach((value: string) => {
            if (Array.isArray(uniqueTEIvalues2GeneIds[value]))
              uniqueTEIvalues2GeneIds[value].push(id);
            else uniqueTEIvalues2GeneIds[value] = [id];
          });
        }
      });

      const uniqueTEIvaluesContingencyTables: { [key: string]: number[] } =
        Object.entries(uniqueTEIvalues2GeneIds).reduce(
          (acc: { [key: string]: number[] }, [key, ids]) => {
            if (ids.some((id) => geneIdsTEFpos.has(id))) {
              const geneIdsTEIpos = new Set(ids);
              const geneIdsTEIneg = new Set(
                universe.filter((id) => !geneIdsTEIpos.has(id))
              );
              const contingencyTable = constructContingencyTable(
                geneIdsTEFpos,
                geneIdsTEFneg,
                geneIdsTEIpos,
                geneIdsTEIneg
              );
              acc[key] = contingencyTable;
            }
            return acc;
          },
          {}
        );
      return uniqueTEIvaluesContingencyTables;
    }
    default:
      throw new Error(`unsupported selector type ${options.TEIselectorType}`);
  }
}
