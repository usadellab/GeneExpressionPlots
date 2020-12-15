import { makeAutoObservable } from 'mobx';
import { objectFromArrays } from '@/utils/collection';


export class Dataframe {

  header = [];
  rows = {};

  constructor () {
    makeAutoObservable(this);
  }

  loadFromObject (table) {
    this.header = table.header;
    this.rows = table.rows;
  }

  /* COMPUTED */

  get rowNames () {
    return Object.keys(this.rows);
  }

  get colNames () {
    return this.header;
  }

  /* QUERIES */

  /**
   * Get a single row as an array of values.
   * @param {string} rowName unique row name
   */
  getRow (rowName, depth) {

    if (!depth) return this.rows[rowName];

    const memory = {};

    return this.rows[rowName].reduce((obj, count, index) => {

      const headerSlice = this.header[index].split('*').slice(0, depth).join('*');

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
   * @param {String} rowName unique row name
   */
  getAnnotatedRow (rowName) {
    const row = this.rows[rowName];
    return objectFromArrays(this.header, row);
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
   * @param {String} rowName
   * @param {any[]} row
   */
  addRow (rowName, row){
    this.rows[rowName] = row;
  }

}
