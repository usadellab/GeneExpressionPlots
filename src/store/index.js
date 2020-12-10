import {
  action,
  computed,
  makeObservable,
  observable,
} from 'mobx';

import {
  computeAveragesAndVariances,
  createGroupPlot,
  createMultiGeneBarPlot,
  createStackedLinePlot
} from '../utils/plotsHelper';

import { objectFromArrays } from '@/utils/collection';

import { PRELOAD_DATA } from '../config/globals';


class DataStore {

  /** @type {Group[]} */
  @observable groups = [];
  @observable plots = [];
  @observable captions = {};
  @observable image = null;
  @observable preloaded = false;

  constructor () {
    makeObservable(this);
    if (PRELOAD_DATA) this.preloaded = true;
  }

  /* DATA */

  /**
   * Get an array of all unique gene accession ids.
   */
  @computed({ keepAlive: true }) get accessionIds() {

    if (this.groups.length === 0)
      return [];

    if (this.groups[0].samples.length === 0)
      return [];

    if (this.groups[0].samples[0].replicates.length === 0)
      return [];

    return Object.keys(this.groups[0].samples[0].replicates[0]).sort();

  }

  @computed({ keepAlive: true }) get hasData () {
    return this.groups.length > 0;
  }

  @computed({ keepAlive: true }) get hasImage () {
    return this.image ? true : false;
  }

  @computed({ keepAlive: true}) get isPreloading () {
    return this.preloaded && this.hasData;
  }

  @computed({ keepAlive: true}) get hasPlots () {
    return this.plots.length > 0;
  }

  /**
   * Reassigns the internal group data to a new object.
   * @param {Group} groups Group object
   */
  @action assignData (groups) {
    this.groups = groups;
  }

  /**
   * Assign a new captions object.
   */
  @action assignCaptions (captions) {
    this.captions = captions;
  }

  /**
   * Add a new group to the store.
   * @param {Group} group
   */
  @action addGroup(group) {
    this.groups.push(group);
  }

  /**
   * Add a new sample to an existing group.
   * @param {string} groupName name of the group
   * @param {Sample} sample
   */
  @action addSample(groupName, sample) {
    let foundGroup = this.groups.find(group => group.name === groupName);
    foundGroup.samples.push(sample);
  }

  @action clearData() {
    this.groups = [];
  }

  /**
   * Delete a group from the store
   * @param {number} index group index in the store
   */
  @action deleteGroup(index) {
    this.groups.splice(index,1);
  }

  @action getCaption(accession) {
    const row = this.captions.rows[accession];
    if (!row) return null;

    const caption = objectFromArrays(this.captions.header, row);
    console.log(caption);
    return caption;
  }

  /* PLOTS */

  /**
   * check if the store has captions
   * @returns {boolean}
   */
  @computed({ keepAlive: true }) get hasCaptions () {
    return this.captions && Object.keys(this.captions).length > 0;
  }

  /**
   * Reassigns the internal image data to a string URL.
   * @param {string} image created URL string from the image Blob
   */
  @action assignImage (image) {
    this.image = image;
  }

  /**
   *
   * @param {string[]} accessionIds
   * @param {boolean} showlegend
   * @param {string} plotType
   */
  @action addBarPlot(accessionIds, showlegend, showCaption, plotTitle) {

    let plotData = computeAveragesAndVariances(this.groups, accessionIds);

    if (accessionIds.length === 1) this.plots.push(
      createGroupPlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        'bar',
        this.plots.length,
        plotTitle,
      )
    );
    else if (accessionIds.length > 1) this.plots.push(
      createMultiGeneBarPlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        this.plots.length,
        plotTitle,
      )
    );

  }

  @action addIndivualCurvesPlot(accessionIds, showlegend, showCaption, plotTitle) {
    let plotData = computeAveragesAndVariances(this.groups, accessionIds);
    this.plots.push(
      createGroupPlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        'scatter',
        this.plots.length,
        plotTitle,
      )
    );
  }

  @action addStackedCurvePlot(accessionIds, showlegend, showCaption, colorBy, plotTitle) {
    let plotData = computeAveragesAndVariances(this.groups, accessionIds);
    this.plots.push(
      createStackedLinePlot(
        plotData,
        accessionIds,
        showlegend,
        showCaption,
        this.groups[0].countUnit,
        this.plots.length,
        colorBy,
        plotTitle,
      )
    );
  }

  @action addPlot(accessionIds, showlegend, showCaption, plotType, colorBy, plotTitle){

    switch (plotType) {
      case 'bars':
        this.addBarPlot(accessionIds, showlegend, showCaption, plotTitle);
        break;
      case 'individualCurves':
        this.addIndivualCurvesPlot(accessionIds, showlegend, showCaption, plotTitle);
        break;
      case 'stackedCurves':
        this.addStackedCurvePlot(accessionIds, showlegend, showCaption, colorBy, plotTitle);
        break;
      default:
        break;
    }
  }

  /**
   * Add replicates to an existing sample within a group. Adds a new sample/group if it doesn't exist yet
   * @param {object} groupView
   * @param {array} replicates
   */
  @action checkAndAddReplicates(groupView, replicates){
    let groupIndex = this.groups.findIndex(group => group.name === groupView.groupName);

    if (groupIndex !== -1) {
      let sampleIndex = this.groups[groupIndex].samples.findIndex(sample => sample.name === groupView.sampleName);
      if (sampleIndex !== -1) {
        this.groups[groupIndex].samples[sampleIndex].replicates.push(...replicates);
      } else {
        let newSample = {
          name: groupView.sampleName,
          xTickValue: groupView.xTickValue,
          replicates: replicates
        };
        this.groups[groupIndex].samples.push(newSample);
      }
    } else {
      let newGroup = {
        name: groupView.groupName,
        countUnit: groupView.countUnit,
        samples: [{
          name: groupView.sampleName,
          xTickValue: groupView.xTickValue,
          replicates: replicates
        }]
      };
      this.groups.push(newGroup);
    }
  }

  /**
   * Delete the existing image legend.
   */
  @action clearImage () {
    this.image = null;
  }

  /**
   * Clear the plots array in the store.
   */
  @action clearPlots () {
    this.plots = [];
  }

  /**
   * Delete a plot from the store
   * @param {number} index plot index in the store
   */
  @action deletePlot(index){
    this.plots.splice(index,1);
  }

}

export class Group {

  /** @type {string} */
  name;

  /** @type {CountUnit} */
  countUnit;

  /** @type {Sample[]} */
  samples;

  constructor (state) {

    this.name = state.name;
    this.countUnit = state.countUnit;
    this.samples = state.samples;
  }
}

export class Sample {
  name;
  xTickValue;

  /** @type {Object<string,number>[]} */
  replicates;
}

export const store = new DataStore();
