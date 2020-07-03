class GeneCountsDb {
  constructor(geneCountInstances){
    this.geneCountInstances = geneCountInstances
  }

  getInstance(condition, replicateNo){
    return this.geneCountInstances.filter(geneCountInstance => geneCountInstance.condition)
  }
}