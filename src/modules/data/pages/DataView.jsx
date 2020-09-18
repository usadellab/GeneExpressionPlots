import React             from 'react';
import { useRouteMatch } from 'react-router-dom';

import AppLink   from '@components/AppLink';
import IconAdd   from '../assets/svg/hi-plus.svg';
import GroupItem from '../components/GroupItem';

import { useDataStore } from '../Home.store';



/**
 * Render a view of existing data and the controls needed to manipulate it.
 * @param {DataViewProps} props properties object for the DataView component
 */
export default function DataView (props) {

  const [ data ] = useDataStore();
  const { path } = useRouteMatch();

  return (
    <div className={ `container p-4 font-abeeze ${props.className || ''}` }>

      {
        data.map((group, index) => (

          <GroupItem
            key={ `${group.name}-${index}`}
            group={ group }
          />

        ))
      }

      <AppLink
        className={`group flex justify-center w-full ${ data.length > 0 ? 'border-t-2' : '' }`}
        to={ `${path}/group/`}
      >
        <IconAdd className="w-24 text-gray-500 group-hover:text-blue-500"/>
      </AppLink>

    </div>
  );
}