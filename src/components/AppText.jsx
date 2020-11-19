import React from 'react';


export default class AppText extends React.Component {

  constructor () {
    super();
    this.state = {
      focus: false,
      hover: false,
    };
  }

  /**
   * Set the focus state and call any passed callback
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onInputFocus = (event) => {
    this.setState({ focus: true });
    if (this.props.onFocus)
      this.props.onFocus(event);
  }

  /**
   * Set the focus state and call any passed callback
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onInputBlur = (event) => {
    this.setState({ focus: false });
    if (this.props.onBlur)
      this.props.onBlur(event);
  }

  render () {

    return (
      <div
        className={ `group ${this.props.className ?? ''}` }
        onMouseEnter={ () => this.setState({ hover: true }) }
        onMouseLeave={ () => this.setState({ hover: false }) }
      >

        <input
          className="py-3 px-4 w-full
                     rounded border-2 border-transparent
                     hover:border-blue-400 focus:border-blue-600
                     shadow-xs bg-gray-100 text-gray-800 text-sm
                     focus:outline-none focus:bg-white group-hover:bg-white"
          id={ this.props.label }
          type="text"
          value={ this.props.value }
          placeholder={ this.props.placeholder }
          onBlur={ this.onInputBlur }
          onChange={ this.props.onChange }
          onClick={ this.props.onClick }
          onFocus={ this.onInputFocus }
        />

        {
          this.props.label && !this.props.labelPosition &&
          <label
            htmlFor={ this.props.label }
            className={
              `px-1 py-1 text-sm
             ${ this.state.focus ? 'text-blue-500' : this.state.hover ? 'text-gray-800' : 'text-gray-600' }`
            }
          >
            { this.props.label }
          </label>
        }

      </div>
    );
  }
}
