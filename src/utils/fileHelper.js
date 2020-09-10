import PapaParse from 'papaparse'

// PapaParse.parse(csvfile, {
//   complete: () => {
//     console.log("finished!: " + JSON.stringify(geneCounts));
//   },
//   header: this.state.header,
//   skipEmptyLines: true,
//   step: (row) => {
//     geneCounts.geneCounts[row.data[Object.keys(row.data)[parseInt(this.state.accessionCol) - 1]]] = row.data[Object.keys(row.data)[parseInt(this.state.countCol) - 1]]

//   }
// });

/**
 * 
 * @param {*} group 
 * @param {*} sampleList 
 */
module.exports.processSampleList = function(groupName, sampleList){
  
  let group = {
    [groupName]: []
  };
  if (Array.isArray(sampleList)){
    sampleList.forEach(sample => {
      validateSampleList(sample)
      group.groupName.push(sample);
    })
  }

  return group;
}

/**
 * 
 */
validateSampleList = function(sampleList){
  let props = ["sampleName", "x-value", "seperator", "acc_col", "cnt_col", "header"];
  if (!props.every(prop => {
    return prop in sampleList;
  })) {
    throw new Error('provided sampleList is missing properties!')
  }
}