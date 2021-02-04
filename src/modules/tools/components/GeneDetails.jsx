import React, { Component } from 'react';

export default class GeneDetails extends Component {
  render() {
    return (
      <div className="flex flex-col flex-auto overflow-hidden overflow-y-scroll">
        <div className="flex p-5 font-semibold bg-yellow-200 uppercase">
          <div className="px-5 w-4/12">Group</div>
          <div className="px-5 w-3/12">Sample</div>
          <div className="px-5 w-2/12">Replicate</div>
          <div className="px-5 w-3/12 text-right">Count [raw]</div>
        </div>
        {this.props.geneCounts.map(({ group, sample, replicate, count }) => (
          <div
            className="flex p-5 odd:bg-gray-100 hover:bg-yellow-100"
            key={`${group}-${sample}-${replicate}`}
          >
            <div className="px-5 w-4/12">{group}</div>
            <div className="px-5 w-3/12">{sample}</div>
            <div className="px-5 w-2/12">{replicate}</div>
            <div className="px-5 w-3/12 text-right">{count}</div>
          </div>
        ))}
      </div>
    );
  }
}
