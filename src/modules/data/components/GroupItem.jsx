import React                   from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import AppButton  from '@components/AppButton';
import IconTrash  from '../assets/svg/hi-trash.svg';
import IconPencil from '../assets/svg/hi-pencil.svg';

import { useDataStore } from '../store/context';



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
    <div className="flex mt-1 text-sm">
      <span className="text-gray-500">{ label }</span>
      <span className="ml-1 text-gray-600">{ value }</span>
    </div>
  );
};


/**
 * Render a Group item summary.
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

  const { dispatch } = useDataStore();
  const { path }     = useRouteMatch();

  return (
    <div className={
      `mb-6 px-6 py-8 flex flex-col items-center
       shadow-lg border border-white
       hover:border hover:border-gray-300
       hover:bg-blue-200
       ${className}`
    }>

      <header className="flex flex-col w-full mb-6" >

        <h2 className="text-xl text-gray-800">{ group.name }</h2>

        <div className="mt-2" >
          <GroupItemStat label="Units:" value={ group.countUnit } />
          <GroupItemStat label="Samples:" value={ group.samples.length } />
        </div>

      </header>

      <section className="w-full">

        {/* <h2 className="text-2xl font-medium text-gray-900 mb-2" >
          { groupKey }
        </h2> */}

        <p className="mt-1 overflow-hidden leading-relaxed text-gray-700" >
          { group.describe }
        </p>

        <div
          className="inline-flex items-center mt-4 text-gray-500"
        >

          <Link to={{ pathname: `${path}/group/${groupIndex}`, state: { group, groupIndex } }} >
            <AppButton className="group rounded-full" >
              <IconPencil className="w-6 group-hover:text-blue-700" />
            </AppButton>
          </Link>

          <AppButton
            className="group p-1 rounded-full"
            onClick={ () => dispatch({
              type: 'DELETE',
              payload: { key: groupIndex, value: group }
            })}
          >
            <IconTrash className="w-6 h-6 group-hover:text-pink-700" />
          </AppButton>

        </div>

      </section>

    </div>
  );
}
