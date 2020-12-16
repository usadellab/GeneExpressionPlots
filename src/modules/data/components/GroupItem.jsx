import React from 'react';

import AppButton from '@components/AppButton';
import AppIcon   from '@components/AppIcon';

import { store } from '@/store';
import { observer } from 'mobx-react';


/**
 * Render group stats HTML element.
 *
 * @typedef  {Object} GroupItemStatProps Properties object for the GroupStat component
 * @property {string} label item label
 * @property {string} value item value
 *
 * @param {GroupItemStatProps} props component properties
 */
const GroupItemStat = (props) => {

  const { label, value } = props;

  return (
    <div className={`flex mt-1 text-sm ${props.className}`}>
      <span className="text-gray-700 font-bold">{ label }</span>
      <span className="ml-1 text-gray-800">{ value }</span>
    </div>
  );
};


/**
 * Render a Group item summary.
 *
 * @typedef {import('../store/types').Group} Group
 *
 * @typedef  {Object} GroupItemProps Properties object for the GroupItem component.
 * @property {string} className  css classest to apply in the root element
 * @property {number} groupIndex group index in the store
 * @property {Group}  group      group object in the store
 *
 * @param {GroupItemProps} props properties object
 */
@observer
export default class GroupItem extends React.Component {

  constructor () {
    super();
  }

  handleGroupDelete = (groupIndex) => store.deleteGroup(groupIndex);

  get groupReplicates () {
    return this.props.group.samples.reduce(
      (acc, sample) => acc += sample.replicates.length,
      0
    );
  }

  render () {
    return (
      <div className={
        `flex items-center p-6 shadow-lg bg-white ${this.props.className}`
      }>

        <div className="w-full" >

          <h2 className="text-lg text-gray-800">{ this.props.group.name }</h2>

          <div className="sm:flex mt-2" >
            {/* <GroupItemStat label="Units:" value={ this.props.group.countUnit } /> */}
            <GroupItemStat className="sm:ml-4" label="Samples:" value={ this.props.group.sampleCount } />
            <GroupItemStat className="sm:ml-4" label="Replicates:" value={ this.props.group.replicateCount } />
          </div>

        </div>

        <div
          className="inline-flex items-center text-gray-500"
        >

          {
            !store.preloaded &&
            <AppButton
              className="group p-1 rounded-full"
              onClick={ () => {} }
            >
              <AppIcon file="hero-icons" id="trash" className="w-6 h-6 group-hover:text-pink-700" />
            </AppButton>
          }

        </div>


      </div>
    );
  }
}
