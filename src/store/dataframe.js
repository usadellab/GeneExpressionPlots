import { makeAutoObservable } from 'mobx';

export class Dataframe {

  constructor(columnNames, rows){
    this.columnNames = columnNames; 
    this.rows = rows;
    makeAutoObservable(this);
  }
  /**
   * 
   * @param {String} accessionId 
   */
  getRow(accessionId) {
    return this.rows[accessionId] ? this.rows[accessionId] : null;
  }

  /**
   * 
   * @param {String} accessionId 
   */
  getAnnotatedRow(accessionId) {
    return this.columnNames.reduce((acc,curr,i) => {
      acc[curr] = this.rows[accessionId][i];
      return acc;
    }, {});
  }

  /**
   * 
   * @param {Number} index 
   * @param {String} separator 
   */
  getColumnByIndex(index, separator) {
    return this.columnNames[index].split(separator);
  }

  get accessionIds() {
    return Object.keys(this.rows);
  }

  /**
   * 
   * @param {String} accessionId 
   * @param {any[]} row 
   */
  addRow(accessionId, row){
    this.rows[accessionId] = row;
  }

  assignDataFrame(columnNames, rows) {
    this.columnNames = columnNames; 
    this.rows = rows;
  }
}

export const dataTable = new Dataframe();