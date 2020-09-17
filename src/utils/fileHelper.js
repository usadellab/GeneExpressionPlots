import papa from 'papaparse';

/**
 * processSampleList - process a List of samples, given a group and a countUnit into a group of samples and their replicates.
 * @param {string} groupName name of the group to assign
 * @param {string} countunit the unit in which the count is given
 * @param {Array} sampleList Array of the provided samples of the format:
 * [
  {
    "sampleName": "",           // string
    "xTickValue": "",           // number
    "replicates": [
      {
        "separator": "",        // string
        "accessionColumn": "",  // number
        "countColumn": "",      // number
        "header": "",           // boolean
        "file": ""              // FileObject
      },
      ...
    ]
  },
  ...
]
 * 
 * @returns {object} group of the format:
 * 
 * {
  "[groupName]": {
    "countUnit": "string"     // raw, tpm, rmpk, etc.
    "samples":
    [
      {
        "name": "string",       // eg "DAS0"
        "xTickValue": "number", // this might also be a timestamp (future)?
        "replicates": [
          // measurements
        ]
      },
      ...
    ],
    ...  
  ],
  ...
}
 */
export const processSampleList = async function(groupName, countUnit, sampleList){
  
  let group = {
    [groupName]: {
      "countUnit": countUnit,
      "samples": []
    }
  };

  for (let sample of sampleList){
    group[groupName].samples.push(await processSample(sample));
  }
  
  return group;
};

/**
 * processSample - process one sample by parsing
 * @param {object} sample one sample of the above format
 * 
 * @returns {array} a list of replicate objects each with the accessions and their respective counts. Of the form:
 * 
 * [
  {
    "PGSC0003DMT400039136":"1",
    "PGSC0003DMT400039134":"22",
    "PGSC0003DMT400039133":"0"
    ...
  },
  ...
]
 */
export const processSample = async function(sample) {
  validateSample(sample);
  try {
    let processedSample = {
      "name": sample.name,
      "xTickValue": sample.xTickValue
    };
    let replicates = await Promise.all([...sample.replicates].map((replicate) => {
      return parseCsv(replicate.file, replicate);
    }));
    processedSample.replicates = replicates;
    return processedSample;
  } catch (error) {
    throw error;
  }
};

/**
 * validateSample - validates the orrect attributes are present in the given sample
 * @param {objcet} sample one sample of the above format
 * 
 * @returns true if no Error, otherwise throws appropriate Error
 */
export const validateSample = function(sample){
  let sampleProps = ["name", "xTickValue","replicates"];
  let replicateProps = ["separator","accessionColumn","countColumn","header","file"];

  if(sample.replicates === undefined || sample.replicates === null || !Array.isArray(sample.replicates) || (Array.isArray(sample.replicates) && sample.replicates.length < 1)){
    throw new Error('provided sample has no replicates assigned!');
  }

  if (!sampleProps.every(prop => {
    return prop in sample;
  })) {
    throw new Error('provided sample is missing properties!');
  }

  sample.replicates.forEach(replicate => {
    if (!replicateProps.every(prop => {
      return prop in replicate;
    })) {
      throw new Error('provided replicates are missing properties!');
    }
  });
  return true;
};

/**
 * parseCsv - parse the csv file with papaparse and the given parameters
 * @param {object} file FileObject to be parsed
 * @param {object} config configuration object for papaparse 
 * 
 * @returns {Promise} returns a Promise for the file to be parsed.
 */
export const parseCsv = function(file, config){
  return new Promise((resolve, reject) => {
    let geneCounts = {};
    papa.parse(file, {
      complete: () => {
        resolve(geneCounts);
      },
      error: reject,
      step: (row) => {
        geneCounts[row.data[Object.keys(row.data)[config.accessionColumn - 1]]] = row.data[Object.keys(row.data)[config.countColumn - 1]];
      },
      header: config.header,
      skipEmptyLines: true
    });
  });
};