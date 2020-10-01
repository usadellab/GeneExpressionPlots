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
        className="relative group"
      >
        <AppText
          className="group:"
          label="Accession ID"
          value={ this.props.value }
          onFocus={ () => this.setState({ focus: true }) }
          onBlur={ () => this.setState({ focus: false }) }
          onChange={ (e) => this.props.onChange(e.target.value) }
        />

        <ul
          className={
            `absolute py-4 z-40 w-full
             shadow-outer bg-white
             ${ this.state.focus ? 'visible' : 'hidden' }`
          }
        >
          {
            this.props.options.map((opt, index) => (
              <li
                key={ `${opt}-${index}` }
                className="px-3 py-1 hover:bg-gray-200 cursor-default"
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