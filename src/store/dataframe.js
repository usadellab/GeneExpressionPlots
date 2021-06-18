import { makeAutoObservable } from 'mobx';
import { mapFromArrays } from '../utils/collection';
import { buildTreeBranches } from '../utils/reducers';
import iwanthue from 'iwanthue';

/**
 * @typedef  {Object<string, string[]>} Rows table row
 **/

/**
 * @typedef  {Object} TableObject In-memory representation of a parsed table
 * @property {string[]}   header array of column names
 * @property {Rows}         rows array of row objects
 **/

export class Dataframe {
  /** @type {string[]} */
  header = [];

  /** @type {Row} */
  rows = {};

  /**
   * @typedef  {Object} DataframeConfig Dataframe class options
   * @property {string} multiHeader separator for tree-like headers
   **/
  config = {
    multiHeader: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Load the dataframe with an already parsed table.
   * @param {TableObject}     table
   * @param {DataframeConfig | null} config
   */
  loadFromObject(table, config) {
    Object.assign(this.config, config);
    this.header = table.header;
    this.rows = table.rows;
  }

  /* COMPUTED */

  get rowNames() {
    return Object.keys(this.rows);
  }

  get colNames() {
    return [...this.header];
  }

  get colGroups() {
    return this.header.map((groups) => groups.split(this.config.multiHeader));
  }

  /**
   * @return {Object<string,Object<string,string>}
   */
  get headerObject() {
    const branches = Array.from(
      this.colNames.map((name) => name.split(this.config.multiHeader))
    );
    return branches.reduce(buildTreeBranches, {});
  }

  get hasData() {
    return this.colNames.length > 0;
  }

  get groupsAsArray() {
    return Object.keys(this.headerObject);
  }

  get samplesAsArray() {
    let sampleSet = [];
    Object.values(this.headerObject).forEach((samples) => {
      sampleSet.push(...Object.keys(samples));
    });
    return [...new Set(sampleSet)];
  }

  /* QUERIES */

  /**
   * Transforms the `rows` to a two dimensional array, where the first
   * dimension are the rows and the second the columns.
   *
   * @return {Array} two dimensional array of data points
   */
  to2dArray() {
    return Object.keys(this.rows).map((k) => this.rows[k]);
  }

  /**
   * Transforms the `rows` to a two dimensional array, where the first
   * dimension are the columns and the second are the rows.
   *
   * @return {Array} two dimensional array of replicates
   */
  toTransposed2dArray() {
    let arr2D = this.to2dArray();
    return arr2D[0].map((_, colIndex) => arr2D.map((row) => row[colIndex]));
  }

  /**
   * Assigns each combination of group and sample a unique color and returns an
   * Array of these colors, one for each replicate (column) in the data.
   *
   * @return {Array} an array of color values, one for each replicate.
   * Replicate belonging to the same group and sample will have the same color.
   */
  replicateColorsByGroupAndSample() {
    let n_groups_samples = Object.keys(this.headerObject)
      .map((groupName) => Object.keys(this.headerObject[groupName]).length)
      .reduce((acc, curr) => acc + curr, 0);
    let palette = iwanthue(n_groups_samples);
    const sampleNamesToIndices = this.colNames.reduce((acc, curr, index) => {
      const sampleName = curr
        .split(this.config.multiHeader)
        .slice(0, 2)
        .join(this.config.multiHeader);
      acc[sampleName]
        ? acc[sampleName].push(index)
        : (acc[sampleName] = [index]);
      return acc;
    }, {});
    const colors = Object.keys(sampleNamesToIndices).reduce(
      (acc, curr, index) => {
        const indeces = sampleNamesToIndices[curr];
        indeces.map((i) => (acc[i] = palette[index]));
        return acc;
      },
      []
    );

    return colors;
  }

  /**
   * Get a single row as an array of values.
   * @param {string} rowName unique row name
   */
  getRow(rowName) {
    return this.rows[rowName];
  }

  /**
   * In multi-header configurations, return the cells of a single row grouped
   * by a subset of their respective headers. The returned object is a custom
   * Map of array_key-array_value pairs.
   *
   * - Each key is an array with the composite column header group elements.
   * - Each value is an array of cell values under that header group.
   *
   * @param {string} rowName unique row name
   * @param {number} groupBy sub-header index
   */
  getRowAsGroups(rowName, groupBy) {
    if (!this.config.multiHeader) {
      console.error(
        'The groupBy option of getRow is only supported in multi-header dataframes'
      );
      return null;
    }

    const memory = {};

    return this.rows[rowName].reduce((obj, count, index) => {
      const headerSlice = this.header[index]
        .split(this.config.multiHeader)
        .slice(0, groupBy + 1)
        .join(this.config.multiHeader);

      if (!memory[headerSlice]) memory[headerSlice] = headerSlice.split('*');

      const refKey = memory[headerSlice];

      if (!obj.has(refKey)) obj.set(refKey, []);

      obj.get(memory[headerSlice]).push(count);

      return obj;
    }, new Map());
  }

  /**
   * Get a single row as an object of key-value pairs.
   *
   * - Each key represents the column header for a single cell value.
   * - Each value represents the value of the cell.
   *
   * @param {String} rowName unique row name
   */
  getRowAsMap(rowName, splitGroups = false) {
    const columns = splitGroups
      ? this.header.map((groups) => groups.split(this.config.multiHeader))
      : this.header;
    return mapFromArrays(columns, this.rows[rowName]);
  }

  /**
   *
   * @param {String} rowName unique row key
   * @returns {object} tree-like object mapping the multi-index levels to the row
   */
  getRowAsTree(rowName) {
    const row = this.rows[rowName];
    return this.header.reduce((tree, column, i) => {
      let split = column.split(this.config.multiHeader);
      let group = split[0];
      let sample = split[1];
      tree[group]
        ? tree[group][sample]
          ? tree[group][sample].push(row[i])
          : (tree[group][sample] = [row[i]])
        : (tree[group] = { [sample]: [row[i]] });
      return tree;
    }, {});
  }

  /**
   * Get multiple rows from the dataframe
   * @param {array} rowNames unique row name
   * @returns {object} returns the specified rows.
   */
  getRows(rowNames) {
    return rowNames.reduce(
      (obj, rowName) => ({ ...obj, [rowName]: this.rows[rowName] }),
      {}
    );
  }

  /**
   *
   * @param {Number} index
   * @param {String} separator
   */
  getColumnByIndex(index, separator) {
    return this.header[index].split(separator);
  }

  /* MUTATIONS */

  /**
   *
   * @param {string} header
   * @param {[string,string][]} rows
   */
  addColumn(header, rows) {
    // Append new column header
    this.header.push(header);

    // Append cell values to each row
    rows.forEach(([rowName, cellValue]) => {
      if (!this.rows[rowName]) {
        console.warn(`${rowName} is not a known gene accession`);
        return;
      }

      this.rows[rowName].push(cellValue);
    });
  }

  /**
   *
   * @param {String} rowName
   * @param {any[]} row
   */
  addRow(rowName, row) {
    this.rows[rowName] = row;
  }

  clearData() {
    this.header = [];
    this.rows = {};
  }

  removeColumns(...colNames) {
    // Compose a new header array, without the matching columns
    const cols = this.colNames.filter((name) => !colNames.includes(name));

    // Compose a new rows object, without the matching columns
    const colIndexes = this.colNames.find((name) => colNames.includes(name));
    const colSet = new Set(colIndexes);
    const rows = Object.fromEntries(
      Object.entries(this.rows).map(([rowName, rowValues]) => [
        rowName,
        rowValues.filter((value, index) => !colSet.has(index)),
      ])
    );

    this.header = cols;
    this.rows = rows;
  }

  dataFrametoString(separator) {
    let dataframeAsString = 'Gene-ID' + separator;

    dataframeAsString += this.header.join(separator);
    dataframeAsString += '\n';

    Object.keys(this.rows).forEach((rowName) => {
      dataframeAsString += rowName + separator;
      dataframeAsString += this.rows[rowName].join(separator);
      dataframeAsString += '\n';
    });

    return dataframeAsString;
  }
}
