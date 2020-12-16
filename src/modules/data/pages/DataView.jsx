import React        from 'react';
import { observer } from 'mobx-react';

import GroupItem from '../components/GroupItem';

import { dataTable } from '@/store/data-store';


@observer
export default class DataView extends React.Component {

  constructor () {
    super();
    this.state = {
      showGroup: false,
    };
  }

  computeStats = () => {
    return Object.entries(dataTable.headerObject).map(([ groupName, sample ]) => {
      return {
        name: groupName,
        sampleCount: Object.keys(sample).length,
        replicateCount: Object.values(sample).reduce((sum,replicates) => sum+=replicates.length,0)
      };
    });
  }

  render () {
    return (
      <div className={ `relative w-full ${this.props.className || ''}` }>

        {
          this.computeStats().map((group, index) => (

            <GroupItem
              className="mt-6 first:mt-0"
              key={ `${group.name}-${index}`}
              group={ group }
            />

          ))
        }

      </div>
    );
  }
}