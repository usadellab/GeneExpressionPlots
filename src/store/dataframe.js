import { makeAutoObservable } from 'mobx';
import { objectFromArrays } from '@/utils/collection';
import { buildTreeBranches } from '@/utils/reducers';

/**
 * @typedef  {Object<string, string[]>} Row table row
**/

/**
 * @typedef  {Object} TableObject In-memory representation of a parsed table
 * @property {string[]}   header array of column names
 * @property {Row[]}        rows array of row objects
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
    multiHeader: ''
  }

  constructor () {
    makeAutoObservable(this);
  }

  /**
   * Load the dataframe with an already parsed table.
   * @param {TableObject}     table
   * @param {DataframeConfig} config
   */
  loadFromObject (table, config) {
    Object.assign(this.config, config);
    this.header = table.header;
    this.rows = table.rows;
  }

  /* COMPUTED */

  get rowNames () {
    return Object.keys(this.rows);
  }

  get colNames () {
    return [ ...this.header ];
  }

  /**
   * @return {Object<string,Object<string,string>}
   */
  get headerObject () {
    const branches = Array.from(this.colNames.map(name => name.split(this.config.multiHeader)));
    return branches.reduce(buildTreeBranches, {});
  }

  /* QUERIES */

  /**
   * Get a single row as an array of values.
   * @param {string} rowName unique row name
   */
  getRow (rowName) {
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
  getRowAsGroups (rowName, groupBy) {

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
        .slice(0, groupBy+1)
        .join(this.config.multiHeader);

      if (!memory[headerSlice])
        memory[headerSlice] = headerSlice.split('*');

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
  getRowAsObject (rowName) {
    return objectFromArrays(this.header, this.rows[rowName]);
  }

  /**
   *
   * @param {String} rowName unique row key
   * @returns {object} tree-like object mapping the multi-index levels to the row
   */
  getRowAsTree (rowName) {
    const row = this.rows[rowName];
    return this.header.reduce((tree,column,i) => {
      let split = column.split(this.config.multiHeader);
      let group = split[0];
      let sample = split[1];
      tree[group]
        ? (tree[group][sample]
          ? tree[group][sample].push(row[i])
          : tree[group][sample] = [row[i]])
        : tree[group] = {[sample]:[row[i]]};
      return tree;
    }, {});
  }

  /**
   * Get multiple rows from the dataframe
   * @param {array} rowNames unique row name
   * @returns {object} returns the specified rows.
   */
  getRows (rowNames) {
    return rowNames.reduce((obj, rowName) => ({ ...obj, [rowName]: this.rows[rowName] }), {});
  }

  /**
   *
   * @param {Number} index
   * @param {String} separator
   */
  getColumnByIndex (index, separator) {
    return this.header[index].split(separator);
  }

  /* MUTATIONS */

  /**
   *
   * @param {string} header
   * @param {[string,string][]} rows
   */
  addColumn (header, rows) {

    // Append new column header
    this.header.push(header);

    // Append cell values to each row
    rows.forEach(([ rowName, cellValue ]) => {

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
  addRow (rowName, row){
    this.rows[rowName] = row;
  }

  removeColumn (colName) {

    /**
     * Match the provided column name to an index in the dataframe header.
     * In multi-column dataframes, this can return multiple indexes.
     */
    const matches = this.colNames
      .reduce((result, colHeader, index ) => {

        // In a multi-header dataframe, the header is an array of headers
        if (this.config.multiHeader)
          colHeader = colHeader.split(this.config.multiHeader);

        if (colHeader.includes(colName)) result.push(index);

        return result;

      }, []);

    // Compose a new header array, without the matching columns
    const cols = this.colNames.filter((name, index) => !matches.includes(index));

    // Compose a new rows object, without the matching columns
    const rows = Object.entries(this.rows).reduce((newRows, [ rowName, rowValues]) => {
      const newRow = rowValues.filter((cell, index) => !matches.includes(index));
      newRows[rowName] = newRow;
      return newRows;
    }, {});

    this.header = cols;
    this.rows = rows;

  }

}
