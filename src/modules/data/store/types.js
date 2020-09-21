/**
 * @typedef  {'Raw'|'RPKM'|'TPM'} CountUnit Group count column unit
**/

/**
 * @typedef  {Object<string, number>} Replicate Replicate data in a sample.
**/

/**
 * @typedef  {Object} Sample Sample data.
 * @property {string}      name       name of the sample
 * @property {number}      xTickValue     value in the x-axis
 * @property {Replicate[]} replicates array of replicates
**/


export class Group {

  name = '';
  describe = '';

  /** @type {CountUnit} */
  countUnit = '';

  /** @type {Sample[]} */
  samples = [];
}
