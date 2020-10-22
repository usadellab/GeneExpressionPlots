import React from 'react';


export default class AppIcon extends React.Component {

  render () {
    return (
      <svg { ...this.props } >
        <use xlinkHref={ `${this.props.file}.svg#${this.props.file}_${this.props.id}` } />
      </svg>
    );
  }
}
