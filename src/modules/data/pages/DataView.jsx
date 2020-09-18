import React             from 'react';
import { useRouteMatch } from 'react-router-dom';

import AppLink   from '@components/AppLink';
import IconAdd   from '../assets/svg/hi-plus.svg';
import GroupItem from '../components/GroupItem';

import { useDataStore } from '../Home.store';



export default function DataView (props) {

  const [ data ] = useDataStore();
  const { path } = useRouteMatch();

  return (
    <div className={ `container font-abeeze ${props.className || ''}` }>

      {
        Object.entries(data).map(([groupKey, groupValue ], index) => (

          <GroupItem
            key={ `${groupKey}-${index}`}
            groupKey={ groupKey }
            groupValue={ groupValue }
          />

        ))
      }

      <AppLink
        className={`group flex justify-center w-full ${ data ? 'border-t-2' : '' }`}
        to={ `${path}/group/`}
      >
        <IconAdd className="w-24 text-gray-500 group-hover:text-blue-500"/>
      </AppLink>

    </div>
  );
}