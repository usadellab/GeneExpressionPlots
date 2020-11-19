
import React from 'react';


export default class AppSwitch extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      switchValue: props.checked,
    };
  }
  // const { className, label, ...inputProps } = props;

  toggleSwitch = () => {

    this.setState(state => {
      this.props.onChange(!state.switchValue);
      return { switchValue: !state.switchValue };
    });
  }

  render () {
    return (
      <div
        className={ `relative flex items-center ${this.props.className}` }
        onClick={ this.toggleSwitch }
      >

        <div
          className={
            `relative flex flex-shrink-0 my-3 h-6 w-12
             border-2 border-transparent cursor-pointer rounded-full
             focus:outline-none focus:shadow-outline
             transition-colors duration-200 ease-in-out
             ${this.state.switchValue ? 'bg-green-800' : 'bg-gray-300' }`}
        >
          <span
            className={
              `w-1/2 bg-white rounded-full
              transition duration-200 ease-in-out
              transform ${this.state.switchValue ? 'translate-x-full' : 'translate-x-0' }`
            }
          />
        </div>

        <label
          htmlFor={ this.props.label }
          className={
            `ml-2 text-sm
           ${ this.state.focus ? 'text-blue-500' : this.state.hover ? 'text-gray-800' : 'text-gray-600' }`
          }
        >
          { this.props.label }
        </label>
      </div>
    );
  }
}