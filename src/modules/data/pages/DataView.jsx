import React         from 'react';
import { observer }  from 'mobx-react';

import AppLink   from '@components/AppLink';
import IconAdd   from '@assets/svg/hi-plus.svg';
import GroupItem from '../components/GroupItem';

import { store } from '@/store';


@observer
export default class DataView extends React.Component {

  render () {
    return (
      <div className={ `container font-abeeze ${this.props.className || ''}` }>

        {
          store.groups.map((group, index) => (

            <GroupItem
              key={ `${group.name}-${index}`}
              group={ group }
              groupIndex={ index }
            />

          ))
        }

        <AppLink
          className="group flex justify-center"
          to={ `${this.props.location.pathname}/group/` }
        >
          <IconAdd className="w-24 text-gray-500 group-hover:text-blue-700"/>
        </AppLink>

      </div>
    );
  }
}