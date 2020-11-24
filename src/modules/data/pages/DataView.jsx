import React        from 'react';
import { observer } from 'mobx-react';

import GroupItem from '../components/GroupItem';

import { store } from '@/store';


@observer
export default class DataView extends React.Component {

  constructor () {
    super();
    this.state = {
      showGroup: false,
    };
  }

  showGroupView = () => {
    this.setState({ showGroup: true });
  }

  hideGroupView = () => {
    this.setState({ showGroup: false });
  }

  render () {
    return (
      <div className={ `relative w-full ${this.props.className || ''}` }>

        {
          store.groups.map((group, index) => (

            <GroupItem
              className="mt-6 first:mt-0"
              key={ `${group.name}-${index}`}
              group={ group }
              groupIndex={ index }
            />

          ))
        }

      </div>
    );
  }
}