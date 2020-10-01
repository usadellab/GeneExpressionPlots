import React                   from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import AppButton  from '@components/AppButton';
import IconTrash  from '@assets/svg/hi-trash.svg';
import IconPencil from '@assets/svg/hi-pencil.svg';




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
      <span className="text-gray-500">{ label }</span>
      <span className="ml-1 text-gray-600">{ value }</span>
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
export default function GroupItem (props) {

  const { className, group, groupIndex } = props;

  // const { path }     = useRouteMatch();

  const groupReplicates = group.samples.reduce(
    (acc, sample) => acc += sample.replicates.length,
    0
  );

  return (
    <div className={
      `flex items-center mb-6 p-6
       shadow-lg
       bg-blue-200 hover:bg-blue-300
       ${className}`
    }>

      <div className="w-full" >

        <h2 className="text-lg text-gray-800">{ group.name }</h2>

        <div className="flex mt-2" >
          <GroupItemStat label="Units:" value={ group.countUnit } />
          <GroupItemStat className="ml-4" label="Samples:" value={ group.samples.length } />
          <GroupItemStat className="ml-4" label="Replicates:" value={ groupReplicates } />
        </div>

      </div>

      <div
        className="inline-flex items-center text-gray-500"
      >

        {/* <Link to={{ pathname: `${path}/group/${groupIndex}`, state: { group, groupIndex } }} >
          <AppButton className="group rounded-full" >
            <IconPencil className="w-6 group-hover:text-blue-700" />
          </AppButton>
        </Link> */}

        {/* <AppButton
          className="group p-1 rounded-full"
          onClick={ () => dispatch({
            type: 'DELETE',
            payload: { key: groupIndex, value: group }
          })}
        >
          <IconTrash className="w-6 h-6 group-hover:text-pink-700" />
        </AppButton> */}

      </div>


    </div>
  );
}
