import React from 'react';

import AppText from './AppText';

export default class AppDatalist extends React.Component {

  constructor () {

    super();

    this.state = {
      focus: false
    };
  }

  handleItemClick = (accession) => {

    this.setState({ focus: false });
    this.props.onSelect(accession);
  }

  closeDropDown = () => {

    if (!this.state.focus)
      this.setState({ focus: false });
  }

  render () {

    return (
      <div
        className={ `relative w-full ${this.props.className ?? ''}`}
      >
        <AppText
          label={ this.props.label }
          value={ this.props.value }
          onFocus={ () => this.setState({ focus: true }) }
          onBlur={ () => this.setState({ focus: false }) }
          onChange={ (e) => this.props.onChange(e.target.value) }
        />

        <ul
          className={
            `absolute flex flex-col justify-center items-center w-full py-2 z-50
             shadow-outer bg-white
             ${ this.state.focus ? 'visible' : 'hidden' }`
          }
        >
          {
            this.props.options.map((opt, index) => (
              <li
                key={ `${opt}-${index}` }
                className="px-3 text-gray-900 text-sm hover:bg-blue-700 hover:text-white cursor-default"
                value={ opt }
                onMouseDown={ () => this.handleItemClick(opt) }
              >
                { opt }
              </li>
            ))
          }
        </ul>

      </div>
    );
  }
}