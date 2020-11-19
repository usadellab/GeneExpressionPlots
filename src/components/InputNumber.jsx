import React from 'react';
import BaseInput from './BaseInput';


export default class AppText extends React.Component {

  render () {
    return (
      <BaseInput
        className={ this.props.className }
        type="number"
        label={ this.props.label }
        value={ this.props.value }
        placeholder={ this.props.placeholder }
        max={ this.props.max }
        min={ this.props.min }
        step={ this.props.step }
        onBlur={ this.props.onBlur }
        onChange={ this.props.onChange }
        onClick={ this.props.onClick }
        onFocus={ this.props.onFocus }
      />
    );
  }
}
