import React, { Component } from 'react';

export default class AppAnchor extends Component {
  render() {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        { ...this.props }
      >
        { this.props.children }
      </a>
    );
  }
}
