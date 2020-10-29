import React from 'react';


export default class AppOverlay extends React.Component {

  constructor () {
    super();
    this.defaultContainerClass = `
    `;
  }

  render () {
    return (
      <>
        {/* CONTAINER */}
        <div
          className="fixed inset-0 z-50
                     flex justify-center items-center
                     outline-none focus:outline-none"
        >

          {/* CONTENT */}
          <div className={ this.props.className } >

            { this.props.children }

          </div>

        </div>

        {/* OVERLAY */}
        <div
          className={ `opacity-25 fixed inset-0 z-40 ${this.props.overlayClass}` }
          onClick={ this.props.onClick }
        />

      </>
    );
  }
}