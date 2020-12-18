import React, { Component } from 'react';

export default class GeneDetails extends Component {

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
          this.props.geneCounts.map(({ group, sample, replicate, count }) => (

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
