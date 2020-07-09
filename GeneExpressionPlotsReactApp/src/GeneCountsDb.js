import GeneCounts from "./GeneCounts"

class GeneCountsDb {
  constructor(){
    this.geneCountInstances = [];
  }

  getInstance(condition, replicateNo){
    return this.geneCountInstances.filter(geneCountInstance => geneCountInstance.condition)
  }

  add(geneCountInstance) {
    this.geneCountInstances.push(geneCountInstance)
  }
}

export default GeneCountsDb