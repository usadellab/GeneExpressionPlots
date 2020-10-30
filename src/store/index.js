import {
  action,
  computed,
  observable,
} from 'mobx';

import {
  computeAveragesAndVariances,
  createGroupPlot,
  createStackedLinePlot
} from '../utils/plotsHelper';

import { PRELOAD_DATA } from '../config/globals';


class DataStore {

  /** @type {Group[]} */
  @observable groups = [];
  @observable plots = [];
  @observable captions = {};
  @observable image = null;
  @observable preloaded = false;

  constructor () {
    if (PRELOAD_DATA) this.preloaded = true;
  }

  @computed({ keepAlive: true })
  get accessionIds() {
    if (this.groups.length) {

      if (this.groups[0].samples.length) {

        if (this.groups[0].samples[0].replicates.length) {

          return Object.keys(this.groups[0].samples[0].replicates[0]);

        }
      }
    }
    return [];

  }

  @computed({ keepAlive: true})
  get isPreloading () {
    return this.preloaded && !this.hasData;
  }

  @computed({ keepAlive: true })
  get hasData () {
    return this.groups.length > 0;
  }

  /**
   * check if the store has captions
   * @returns {boolean}
   */
  @computed({ keepAlive: true })
  get hasCaptions() {
    return this.captions && Object.keys(this.captions).length > 0;
  }

  /**
   * Reassigns the internal group data to a new object.
   * @param {Group} groups Group object
   */
  @action assignData (groups) {
    this.groups = groups;
  }

  /**
   * Reassigns the internal caption data to a new object.
   * @param {Group} groups Group object
   */
  @action assignCaptions (captions) {
    this.captions = captions;
  }

  /**
   * Reassigns the internal image data to a string URL.
   * @param {string} image created URL string from the image Blob
   */
  @action assignImage (image) {
    this.image = image;
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
  @action deleteGroup(index){
    this.groups.splice(index,1);
  }

  /**
   * Delete a plot from the store
   * @param {number} index plot index in the store
   */
  @action deletePlot(index){
    this.plots.splice(index,1);
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
   *
   * @param {*} accessionId
   * @param {*} showlegend
   * @param {*} plotType
   */
  @action addBarPlot(accessionId, showlegend, showCaption) {
    let plotData = computeAveragesAndVariances(this.groups, accessionId);
    this.plots.push(
      createGroupPlot(plotData, accessionId, showlegend, showCaption, this.groups[0].countUnit, 'bar', this.plots.length)
    );
  }

  @action addIndivualCurvesPlot(accessionId, showlegend, showCaption) {
    let plotData = computeAveragesAndVariances(this.groups, accessionId);
    this.plots.push(
      createGroupPlot(plotData, accessionId, showlegend, showCaption, this.groups[0].countUnit, 'scatter', this.plots.length)
    );
  }

  @action addStackedCurvePlot(accessionId, showlegend, showCaption) {
    let plotData = computeAveragesAndVariances(this.groups, accessionId);
    this.plots.push(
      createStackedLinePlot(plotData, accessionId, showlegend, showCaption, this.groups[0].countUnit, this.plots.length)
    );
  }

  @action addPlot(accessionId, showlegend, showCaption, plotType){
    switch (plotType) {
      case 'bars':
        this.addBarPlot(accessionId, showlegend, showCaption);
        break;
      case 'individualCurves':
        this.addIndivualCurvesPlot(accessionId, showlegend, showCaption);
        break;
      case 'stackedCurves':
        this.addStackedCurvePlot(accessionId, showlegend, showCaption);
        break;
      default:
        break;
    }
  }

  /**
   * clear the plots array in the store
   */
  @action clearPlots () {
    this.plots = [];
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
