import React from 'react';
import BaseInput from './BaseInput';

export default class AppText extends React.Component {
  render() {
    return (
      <BaseInput
        className={this.props.className}
        type="text"
        label={this.props.label}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onBlur={this.props.onBlur}
        onChange={this.props.onChange}
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }
}
