import React, { Component } from 'react';
import { store } from '@/store';

export default class GeneDetails extends Component {

  constructor (props) {
    super(props);
    this.geneDetails = this.composeGeneDetails(props.accessionId);
  }

  composeGeneDetails = (accessionId) => {

    const results = store.groups.reduce((details, group) => {

      group.samples.forEach(sample => {

        sample.replicates.forEach((counts, index) => {

          details.push({
            group: group.name,
            sample: sample.name,
            replicate: index,
            count: counts[accessionId],
          });

        });

      });

      return details;

    }, []);
    return results;

  }

  render() {
    return (
      <div className="flex flex-col flex-auto overflow-hidden overflow-y-scroll">
        <div className="flex p-5 font-semibold bg-yellow-200 uppercase">
          <div className="px-5 w-2/6">Group</div>
          <div className="px-5 w-2/6">Sample</div>
          <div className="px-5 w-1/6 text-center">Replicate</div>
          <div className="px-5 w-1/6 text-center">Count</div>
        </div>
        {
          this.geneDetails &&
          this.geneDetails.map(({ group, sample, replicate, count }) => (

            <div
              className="flex p-5 odd:bg-gray-100 hover:bg-yellow-100"
              key={ `${group}-${sample}-${replicate}` }
            >
              <div className="px-5 w-2/6">{ group }</div>
              <div className="px-5 w-2/6">{ sample }</div>
              <div className="px-5 w-1/6 text-center">{ replicate }</div>
              <div className="px-5 w-1/6 text-center">{ count }</div>
            </div>

          ))
        }
      </div>
    );
  }
}
