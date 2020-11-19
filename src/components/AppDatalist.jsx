import React from 'react';

import AppText from './AppText';

export default class AppDatalist extends React.Component {

  constructor () {

    super();

    this.state = {
      focus: false,
    };

    this.dataListContainerRef = null;
  }

  get containerWidth () {
    return this.dataListContainerRef
      ? this.dataListContainerRef.clientWidth
      : null;
  }

  /**
   *
   * @param {HTMLDivElement} ref
   */
  setContainerRef = (ref) => {
    this.dataListContainerRef = ref;
  }

  onListItemClick = (option) => {

    this.setState({ focus: false });
    this.props.onSelect(option);
  }

  onAppTextChange = (event) => {
    this.props.onChange(event.target.value);
  }

  onAppTextFocus = (event) => {
    this.setState({ focus: true });
    this.props.onFocus(event);
  }

  onAppTextBlur = (event) => {
    this.setState({ focus: false });
  }

  render () {

    return (
      <div
        ref={ this.setContainerRef }
        className={ `relative w-full ${this.props.className ?? ''}`}
      >
        <AppText
          label={ this.props.label }
          value={ this.props.value }
          onFocus={ this.onAppTextFocus }
          onBlur={ this.onAppTextBlur }
          onChange={ this.onAppTextChange }
        />

        <ul
          style={{ width: this.containerWidth }}
          className={
            `fixed flex flex-col justify-center items-center py-2 z-50
             border bg-white transform -translate-y-6
             ${ this.state.focus ? 'visible' : 'hidden' }`
          }
        >
          {
            this.props.options.length === 0
              ?
              <li>{ this.props.noItemsMessage ?? 'No matches found' }</li>
              :
              this.props.options.map((opt, index) => (
                <li
                  key={ `${opt}-${index}` }
                  className="px-3 w-full cursor-default hover:bg-blue-700
                             text-sm text-center text-gray-900 hover:text-white"
                  value={ opt }
                  onMouseDown={ () => this.onListItemClick(opt) }
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