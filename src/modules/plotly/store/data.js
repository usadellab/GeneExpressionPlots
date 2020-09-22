import mockData from '../../../test_data/mock-DB.json';


/**
 * @typedef {import('../../../modules/data/store').Group} Group
 * @typedef {import('../../../modules/data/store').Sample} Sample
 * @typedef {import('../../../modules/data/store').Replicate[]} Replicate
 */


/* DATA PROCESSING */

/**
 * Compute the count average for each accession in sample replicates.
 * @param {Replicate[]} replicates array of replicates
 * @returns {Object<string,number>} count averages per accession id
 */
const computeAverage = (replicates) => {

  const averages = {};

  replicates.forEach(replicate => {

    for (const [key, value] of Object.entries(replicate)) {

      const meanValue = value / replicates.length;

      if (averages[key])
        averages[key] += meanValue;

      else
        averages[key] = meanValue;

    }
  });
  return averages;
};

/**
 * Compute the count variance for each accession in sample replicates.
 * @param {Replicate[]}           replicates array of replicates
 * @param {Object<string,number>} averages   accession-average key-value pairs
 * @returns {Object<string,number>} count variances per accession id
 */
const computeVariance = (replicates, averages) =>{

  const variances = {};

  replicates.forEach(replicate => {

    for (const [key, value] of Object.entries(replicate)) {

      const squareMeanDiff = ((averages[key] - value)**2)/replicates.length;

      if (variances[key])
        variances[key] += squareMeanDiff;

      else
        variances[key] = squareMeanDiff;
    }

  });

  return variances;
};

/**
 * Compute average and variance of each replicate in the sample.
 *
 * @typedef {Object} SampleMeanVars
 * @property {Object<string,number} averages
 * @property {Object<string,number} variances
 *
 * @param {{}}     result collection of sample averages and variances per accession id
 * @param {Sample} sample a group sample
 */
const sampleAveragesAndVariancesReducer = (result, sample) => {

  const averages  = computeAverage(sample.replicates);
  const variances = computeVariance(sample.replicates, averages);

  return Object.assign(result, {
    [sample.name]: { averages, variances }
  });

};

/**
 * Compute average and variance of each replicate accession in the group samples.
 * @param {{}}    result average and variance of each accession id
 * @param {Group} group  group data
 */
const groupAveragesAndVariancesReducer = (result, group) => {

  return Object.assign(result, {
    [group.name]: group.samples.reduce( sampleAveragesAndVariancesReducer, {} )
  });

};

/**
 * {
 *   [groupName]: {
 *      [sampleName]: {
 *        averages,
 *        variances,
 *      }
 *   }
 * }
 *
 * @typedef {Object<string,SampleData} GroupData
 * @typedef {Object<string,SampleMeanVars} SampleData
 *
 * @type {GroupData}
 */
export const plotData = mockData.reduce( groupAveragesAndVariancesReducer, {} );
console.log(plotData);
