/**
 * @typedef  {Object<string,Group>} SampleGroups Groups of sample data.
**/

/**
 * @typedef  {Object} Group Group of sample data.
 * @property {string}   describe  group description
 * @property {string}   countUnit sample count units _(e.g. tpm)_
 * @property {Sample[]} samples   array of sample data
**/

/**
 * @typedef  {Object} Sample Sample data.
 * @property {string}      name       name of the sample
 * @property {xTickValue}  number     value in the x-axis
 * @property {Replicate[]} replicates array of replicates
**/

/**
 * @typedef  {Object<string, number>} Replicate Replicate data in a sample.
**/
