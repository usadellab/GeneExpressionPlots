import React from 'react';

const GroupCardStat = (props) => {
  const { label, value } = props;

  return (
    <div className={`flex mt-1 text-sm ${props.className}`}>
      <span className="text-gray-700 font-bold">{label}</span>
      <span className="ml-1 text-gray-800">{value}</span>
    </div>
  );
};

export default class GroupCard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div
        className={`flex items-center p-6 shadow-lg bg-white ${this.props.className}`}
      >
        <div className="w-full">
          <h2 className="text-lg text-gray-800">{this.props.group.name}</h2>

          <div className="sm:flex mt-2">
            {/* <GroupItemStat label="Units:" value={ this.props.group.countUnit } /> */}
            <GroupCardStat
              className="sm:ml-4"
              label="Samples:"
              value={this.props.group.sampleCount}
            />
            <GroupCardStat
              className="sm:ml-4"
              label="Replicates:"
              value={this.props.group.replicateCount}
            />
          </div>
        </div>

        <div className="inline-flex items-center text-gray-500">
          {this.props.children}
        </div>
      </div>
    );
  }
}
