/**
 * @typedef  {class} Group oDesc
 * @property {string} name
 * @property {string} describe
 * @property {'Raw'|'RPKM'|'TPM'} countUnit
 * @property {Sample[]} samples
**/
export class Group {

  name = '';
  describe = '';

  /** @type {'Raw'|'RPKM'|'TPM'} */
  countUnit = '';

  /** @type {Sample[]} */
  samples = [];
}
