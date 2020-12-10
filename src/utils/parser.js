/**
 * @typedef  {Object}  ExpTableOptions Options object for the expression table parser
 * @property {number?}  captionsColumn column index with caption strings
 * @property {string}        countUnit one of raw|rpkm|tpm
 * @property {string}   fieldSeparator delimiter for each column field
 * @property {string}  headerSeparator delimiter for each column header-cell
**/
/**
 * Reads an expression table spec as defined [here](url)
 * @param {string}            table table as a single string
 * @param {ExpTableOptions} options parser options
 */
export function readExpressionTable (table, options) {

  const lines = table.split(/\r?\n|\r/);

  /**
   * Extract the header cells containing group, sample, and replicate
   * information.
   */
  const fields = lines
    .shift()
    .split(options.fieldSeparator)
    .slice(1);

  if (options.captionsColumn)
    fields.splice(options.captionsColumn, 1);

  const headerArray = fields.map(fields => fields.split(options.headerSeparator));

  /**
   * Generate the a pseudo-"data" skeleton object, where each value corresponds
   * to a "group".
   */
  const skeleton = headerArray.reduce(
    (skeleton, [ group, sample, replicateNo ]) => {

      // Create a group if it does not exist
      if (!skeleton[group]) skeleton[group] = {
        name: group,
        countUnit: options.countUnit,
        samples: [],
      };

      // Find if there is a matching sample within the group
      const matchingSample = skeleton[group].samples.find(x => x.name === sample);

      // If sample does not exist, create the sample template
      if (matchingSample) {
        matchingSample.replicates[replicateNo] = {};
        return skeleton;
      }

      skeleton[group].samples.push({
        name: sample,
        xTickValue: undefined,
        replicates: { [replicateNo]: {} }
      });

      return skeleton;
    },
    {}
  );

  lines.forEach(line => {

    const counts = line.split(options.fieldSeparator);
    const accessionId = counts.shift();

    counts.forEach((count, index) => {
      const [ group, sample, replicateNo ] = headerArray[index];
      const matchingSample = skeleton[group].samples.find(x => x.name === sample);
      matchingSample.replicates[replicateNo][accessionId] = count;
    });
  });

  Object.keys(skeleton).forEach(group => {
    skeleton[group].samples.forEach(sample => {
      sample.replicates = Object.values(sample.replicates);
    });
  });

  return skeleton;
}