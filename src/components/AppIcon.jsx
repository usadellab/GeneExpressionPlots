import React from 'react';

export default class AppIcon extends React.Component {
  render() {
    return (
      <svg {...this.props}>
        <use xlinkHref={`${this.props.file}.svg#${this.props.id}`} />
      </svg>
    );
  }
}
